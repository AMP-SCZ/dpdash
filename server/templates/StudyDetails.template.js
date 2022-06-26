import basePathConfig from '../configs/basePathConfig'

const basePath = basePathConfig || ''

export default () => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <link rel='stylesheet' href='${basePath}/css/study_details.css' />
        <title>Study Details - DPDash</title>
      </head>
      <body>
        <div id='study_details'></div>
        <script src='${basePath}/js/studyDetails.min.js'>
        </script>
      </body>
  `
}
