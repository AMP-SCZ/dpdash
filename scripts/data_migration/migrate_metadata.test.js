import { ObjectId } from 'mongodb';

import { migrateMetadata } from './migrate_metadata';

describe('migrateMetadata', () => {
  it('copies the metadata document data in dpdata to dpdmongo', async () => {
    const metadata = [
      {
        "_id": new ObjectId("62b5d5226fc289683c85f601"),
        "study": "CA",
        "days": 1,
        "subjects": [
          {
            "subject": "CA00063",
            "synced": {
              "$date": "2022-07-28T12:25:48.033Z"
            },
            "days": 1,
            "study": "CA"
          },
          {
            "subject": "CA00064",
            "synced": "2022-06-24T15:15:46.423+0000",
            "days": 1,
            "study": "CA"
          },
          {
            "subject": "CA00066",
            "synced": "2022-06-24T15:15:46.423+0000",
            "days": 1,
            "study": "CA"
          },
          {
            "subject": "CA00057",
            "synced": {
              "$date": "2022-07-28T12:25:48.007Z"
            },
            "days": 1,
            "study": "CA"
          },
          {
            "subject": "CA00007",
            "synced": {
              "$date": "2022-07-28T12:25:48.062Z"
            },
            "days": 1,
            "study": "CA"
          },
          {
            "subject": "CA00073",
            "synced": "2022-06-24T15:15:46.423+0000",
            "days": 1,
            "study": "CA"
          }
        ],
        "synced": false
      },
      {
        "_id": new ObjectId("62e2804bf8e96ad36c8c61fb"),
        "study": "files",
        "extension": ".csv",
        "glob": "/Users/ivanrts/Downloads/data_for_gnar/files_metadata.csv",
        "path": "/Users/ivanrts/Downloads/data_for_gnar/files_metadata.csv",
        "filetype": "text/csv",
        "encoding": null,
        "basename": "files_metadata.csv",
        "dirname": "/Users/ivanrts/Downloads/data_for_gnar",
        "dirty": false,
        "synced": false,
        "mtime": 1654738589,
        "size": 485,
        "uid": 501,
        "gid": 20,
        "mode": 33252,
        "role": "metadata",
        "collection": "2677f5c4-92c1-4178-aa73-5c6ad647bf9b",
        "updated": {
          "$date": "2022-07-28T12:25:47.852Z"
        },
        "days": 9999,
        "subjects": [
          {
            "subject": "CA",
            "synced": {
              "$date": "2022-07-28T12:25:47.655Z"
            },
            "days": 9999,
            "study": "files"
          },
          {
            "subject": "ProNET",
            "synced": {
              "$date": "2022-07-28T12:25:47.102Z"
            },
            "days": 9999,
            "study": "files"
          }
        ]
      }
    ].sort((a, b) => a._id.toString().localeCompare(b._id.toString()))

    await dataDb.collection('metadata').insertMany(metadata)
    
    const connection = await migrateMetadata();
    await connection.close()

    const updatedMetadata = await appDb.collection('metadata').find({}).toArray()
    const sortedMetadata = updatedMetadata.sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
    
    expect(sortedMetadata.length).toBe(2)
    expect(sortedMetadata[0]).toEqual(metadata[0])
    expect(sortedMetadata[1]).toEqual(metadata[1])
  })
})
