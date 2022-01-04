import HyperFormula from 'hyperformula'

export const initializeHF = initSheetId => {
  const hf = HyperFormula.buildEmpty({
    licenseKey: 'agpl-v3'
  })
  const sheetName = hf.addSheet(initSheetId)
  const sheetId = hf.getSheetId(sheetName)
  return {
    hf,
    sheetName,
    sheetId
  }
}
export const initHFValues = (hf, sheetId, data) => {
  hf.setCellContents(
    {
      row: 0,
      col: 0,
      sheet: sheetId
    },
    data
  )
}
