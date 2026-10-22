import { ApprenticeProfile, InductionProgress, ApprenticeRecord } from '../types/sena';

export const INDUCTION_SPREADSHEET_TITLE = 'SENA - Registro Oficial de Inducción de Aprendices';
export const SHEET_NAME = 'Aprendices';

export const SHEET_HEADERS = [
  'Marca Temporal',
  'Tipo Documento',
  'Número Documento',
  'Nombre Completo del Aprendiz',
  'Ficha de Caracterización',
  'Programa de Formación',
  'Regional SENA',
  'Centro de Formación',
  'Módulos Completados',
  'Puntaje Evaluación Final',
  'Estado de Certificación',
  'Código de Certificado',
  'Fecha de Certificación',
  'Puntos XP',
  'Nivel Alcanzado'
];

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
}

/**
 * Searches in Google Drive for an existing induction spreadsheet or creates a new formatted one.
 */
export async function findOrCreateInductionSheet(accessToken: string): Promise<SpreadsheetInfo> {
  // 1. Search in Drive
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
    INDUCTION_SPREADSHEET_TITLE
  )}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id, name, webViewLink)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!searchRes.ok) {
    const errorBody = await searchRes.text();
    throw new Error(`Error al consultar Google Drive: ${searchRes.status} ${errorBody}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    const existing = searchData.files[0];
    return {
      id: existing.id,
      name: existing.name,
      url: existing.webViewLink || `https://docs.google.com/spreadsheets/d/${existing.id}/edit`
    };
  }

  // 2. Create a new Spreadsheet with the 'Aprendices' sheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: INDUCTION_SPREADSHEET_TITLE
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME,
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error al crear la hoja en Google Sheets: ${createRes.status} ${errText}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl =
    createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 3. Write Headers
  const headerRange = encodeURIComponent(`'${SHEET_NAME}'!A1:O1`);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [SHEET_HEADERS]
      })
    }
  );

  // 4. Style the Header Row with SENA Green (#39A900)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: createdData.sheets?.[0]?.properties?.sheetId || 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_HEADERS.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.223,
                    green: 0.662,
                    blue: 0.0
                  },
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    bold: true,
                    fontSize: 11
                  },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: createdData.sheets?.[0]?.properties?.sheetId || 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: SHEET_HEADERS.length
              }
            }
          }
        ]
      })
    });
  } catch (formatErr) {
    console.warn('Advertencia al aplicar formato de encabezados:', formatErr);
  }

  return {
    id: spreadsheetId,
    name: INDUCTION_SPREADSHEET_TITLE,
    url: spreadsheetUrl
  };
}

/**
 * Reads all rows from the Aprendices sheet.
 */
export async function readApprenticeRecords(
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> {
  const range = encodeURIComponent(`'${SHEET_NAME}'!A:O`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error(`Error al leer los datos de la hoja: ${res.status}`);
  }

  const data = await res.json();
  return data.values || [];
}

/**
 * Fetches and parses all apprentice records into structured objects.
 */
export async function fetchApprenticeRecords(
  accessToken: string,
  spreadsheetId: string
): Promise<ApprenticeRecord[]> {
  const rows = await readApprenticeRecords(accessToken, spreadsheetId);
  if (!rows || rows.length <= 1) return [];

  // Skip header row (index 0)
  return rows.slice(1).map(row => ({
    timestamp: row[0] || '',
    documentType: row[1] || 'CC',
    documentNumber: row[2] || '',
    fullName: row[3] || 'Aprendiz sin nombre',
    ficheNumber: row[4] || '',
    trainingProgram: row[5] || '',
    regional: row[6] || '',
    trainingCenter: row[7] || '',
    completedModules: row[8] || '0 de 5 módulos',
    finalExamScore: row[9] || 'No presentado',
    certificationStatus: row[10] || 'En Curso',
    certificateCode: row[11] || 'Pendiente',
    certificateDate: row[12] || 'No emitido',
    xp: row[13] || '0',
    level: row[14] || 'Nivel 1: Aprendiz Novato'
  }));
}

/**
 * Inserts or updates the apprentice record in the Google Sheets document.
 * If the document number already exists in column C, updates the existing row.
 * Otherwise, appends a new row.
 */
export async function saveApprenticeToSheet(
  accessToken: string,
  spreadsheetId: string,
  profile: ApprenticeProfile,
  progress: InductionProgress
): Promise<{ action: 'inserted' | 'updated'; rowNumber: number }> {
  // Format data row
  const nowStr = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const completedModulesCount = `${progress.completedModules.length} de 5 módulos`;
  const examScore = progress.finalExamScore !== null ? `${progress.finalExamScore}%` : 'No presentado';
  const certificationStatus = progress.finalExamPassed ? 'Aprobado y Certificado' : 'En Curso';
  const certCode = progress.certificateCode || 'Pendiente';
  const certDate = progress.certificateGeneratedAt || 'No emitido';

  const getLevelLabel = (xp: number) => {
    if (xp >= 350) return 'Nivel 4: Maestro del Reglamento';
    if (xp >= 200) return 'Nivel 3: Líder de Ficha';
    if (xp >= 80) return 'Nivel 2: Aprendiz Comprometido';
    return 'Nivel 1: Aprendiz Novato';
  };

  const rowValues = [
    nowStr,
    profile.documentType,
    profile.documentNumber,
    profile.fullName,
    profile.ficheNumber,
    profile.trainingProgram,
    profile.regional,
    profile.trainingCenter,
    completedModulesCount,
    examScore,
    certificationStatus,
    certCode,
    certDate,
    progress.xp.toString(),
    getLevelLabel(progress.xp)
  ];

  // Check if apprentice already exists by reading Column C (Document number)
  const existingRows = await readApprenticeRecords(accessToken, spreadsheetId);
  let existingRowIndex = -1;

  for (let i = 1; i < existingRows.length; i++) {
    const row = existingRows[i];
    if (row && row[2] && row[2].toString().trim() === profile.documentNumber.trim()) {
      existingRowIndex = i + 1; // 1-indexed row number
      break;
    }
  }

  if (existingRowIndex > 0) {
    // Update existing row
    const updateRange = encodeURIComponent(`'${SHEET_NAME}'!A${existingRowIndex}:O${existingRowIndex}`);
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${updateRange}?valueInputOption=USER_ENTERED`;
    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    });

    if (!updateRes.ok) {
      throw new Error(`Error al actualizar fila ${existingRowIndex} en Google Sheets`);
    }

    return { action: 'updated', rowNumber: existingRowIndex };
  } else {
    // Append new row
    const appendRange = encodeURIComponent(`'${SHEET_NAME}'!A:O`);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=USER_ENTERED`;
    const appendRes = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    });

    if (!appendRes.ok) {
      throw new Error('Error al anexar aprendiz a Google Sheets');
    }

    const appendData = await appendRes.json();
    return { action: 'inserted', rowNumber: existingRows.length + 1 };
  }
}
