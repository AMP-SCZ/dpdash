import { ObjectId } from 'mongodb';

import { migrateCharts } from './migrate_charts';

describe('migrateCharts', () => {
  it('copies the chart document data in dpdata to dpdmongo', async () => {
    const charts = [
      {
        "_id": new ObjectId("62e44fea1809d96c00e88ff0"),
        "title": "Edited Form",
        "variable": "surveys_raw_PROTECTED",
        "assessment": "flowcheck",
        "description": "Form Edits",
        "fieldLabelValueMap": [
          {
            "value": "1",
            "label": "VALA",
            "color": "#2217db",
            "targetValues": {
              "CA": "5",
              "ProNET": "5",
              "LA": "5",
              "YA": "5",
              "MA": "5"
            }
          },
          {
            "value": "2",
            "label": "VALB",
            "color": "#e6bd85",
            "targetValues": {
              "CA": "5",
              "ProNET": "5",
              "LA": "5",
              "YA": "5",
              "MA": "5"
            }
          }
        ],
        "owner": "dpdash",
        "updatedAt": "2022-08-24T17:29:04.882Z",
        "sharedWith": [
          "blockedUser"
        ],
        "public": true
      },
      {
        "_id": new ObjectId("62ed997a76d799a7aa67b4ae"),
        "title": "Edited FormPART 2",
        "variable": "surveys_raw_PROTECTED",
        "assessment": "flowcheck",
        "description": "Form Edits",
        "fieldLabelValueMap": [
          {
            "value": "1",
            "label": "VALA",
            "color": "#dba48f",
            "targetValues": {
              "CA": "5",
              "ProNET": "5",
              "LA": "5",
              "YA": "5",
              "MA": "5"
            }
          },
          {
            "value": "2",
            "label": "VALB",
            "color": "#156c21",
            "targetValues": {
              "CA": "5",
              "ProNET": "5",
              "LA": "5",
              "YA": "5",
              "MA": "5"
            }
          },
          {
            "value": "0",
            "label": "Val0",
            "color": "#0d0501",
            "targetValues": {
              "CA": "5",
              "ProNET": "5",
              "LA": "5",
              "YA": "5",
              "MA": "5"
            }
          }
        ],
        "owner": "dpdash",
        "updatedAt": "2022-08-23T16:29:57.048Z",
        "sharedWith": [],
        "public": null
      }
    ].sort((a, b) => a._id.toString().localeCompare(b._id.toString()))

    await dataDb.collection('charts').insertMany(charts)
    
    const connection = await migrateCharts();
    await connection.close()

    const updatedCharts = await appDb.collection('charts').find({}).toArray()
    const sortedCharts = updatedCharts.sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
    
    expect(sortedCharts.length).toBe(2)
    expect(sortedCharts[0]).toEqual(charts[0])
    expect(sortedCharts[1]).toEqual(charts[1])
  })
})
