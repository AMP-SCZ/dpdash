import { ObjectId } from 'mongodb';

import { migrateAssessmentSubjectDayData } from './migrate_assessment_subject_day_data';

describe('migrateAssessmentSubjectDayData', () => {
  it('copies the toc document data and subject assessment collection into assessmentSubjectDayData', async () => {
    await dataDb.createCollection('toc') 

    await dataDb.collection('toc').insertMany([
      {
        "_id": new ObjectId("62b5d5223394ef5768b0cffd"),
        "study": "CA",
        "subject": "CA00007",
        "assessment": "flowcheck",
        "units": "day",
        "start": "1",
        "end": "1",
        "extension": ".csv",
        "glob": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day*.csv",
        "collection": "bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448",
        "time_units": "day",
        "time_start": 1,
        "time_end": 1,
        "path": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day1to1.csv",
        "filetype": "text/csv",
        "encoding": null,
        "basename": "CA-CA00007-flowcheck-day1to1.csv",
        "dirname": "/Users/ivanrts/Downloads/test_data",
        "dirty": false,
        "synced": true,
        "mtime": 1654738581,
        "size": 958,
        "uid": 501,
        "gid": 20,
        "mode": 33252,
        "role": "data",
        "updated": new Date("2022-06-24T15:15:46.542Z"),
      },
      {
        "_id": new ObjectId("62b5d5223394ef5768b0cffb"),
        "study": "CA",
        "subject": "CA00063",
        "assessment": "flowcheck",
        "units": "day",
        "start": "1",
        "end": "1",
        "extension": ".csv",
        "glob": "/Users/ivanrts/Downloads/test_data/CA-CA00063-flowcheck-day*.csv",
        "collection": "84cc7cd0e9167928f399baa3e68876ef7b6bb135de661d828201c930ae672182",
        "time_units": "day",
        "time_start": 1,
        "time_end": 1,
        "path": "/Users/ivanrts/Downloads/test_data/CA-CA00063-flowcheck-day1to1.csv",
        "filetype": "text/csv",
        "encoding": null,
        "basename": "CA-CA00063-flowcheck-day1to1.csv",
        "dirname": "/Users/ivanrts/Downloads/test_data",
        "dirty": false,
        "synced": true,
        "mtime": 1654738584,
        "size": 485,
        "uid": 501,
        "gid": 20,
        "mode": 33252,
        "role": "data",
        "updated": new Date("2022-06-24T15:15:46.423Z")
      }
  ])

    await dataDb.createCollection('bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448')

    await dataDb.collection('bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448').insertMany([
      {
        "_id": new ObjectId("62b5d5213394ef5768b0cf73"),
        "day": 1,
        "reftime": "",
        "timeofday": "",
        "weekday": "",
        "subject_id": "CA00007",
        "site": "CA",
        "mtime": "2022-05-06",
        "surveys_processed_GENERAL": "",
        "surveys_raw_PROTECTED": 1,
        "cnb_processed_GENERAL": "",
        "cnb_raw_PROTECTED": 1,
        "cnb_ss_processed_GENERAL": "",
        "cnb_ss_raw_PROTECTED": 1,
        "eeg_processed_GENERAL": "",
        "eeg_raw_PROTECTED": 1,
        "eeg_ss_processed_GENERAL": "",
        "eeg_ss_raw_PROTECTED": 1,
        "actigraphy_processed_GENERAL": "",
        "actigraphy_raw_PROTECTED": 1,
        "actigraphy_ss_processed_GENERAL": "",
        "actigraphy_ss_raw_PROTECTED": 1,
        "mri_processed_GENERAL": "",
        "mri_raw_PROTECTED": "",
        "mri_ss_processed_GENERAL": "",
        "mri_ss_raw_PROTECTED": "",
        "interview_audio_processed_GENERAL": 1,
        "interview_audio_raw_PROTECTED": "",
        "interview_video_processed_GENERAL": 1,
        "interview_video_raw_PROTECTED": "",
        "interview_transcript_processed_GENERAL": "",
        "interview_transcript_raw_PROTECTED": "",
        "interview_ss_processed_GENERAL": "",
        "interview_ss_raw_PROTECTED": "",
        "mind_phone_processed_GENERAL": "",
        "mind_phone_raw_PROTECTED": "",
        "mind_sensor_processed_GENERAL": "",
        "mind_sensor_raw_PROTECTED": "",
        "mind_ss_processed_GENERAL": "",
        "mind_ss_raw_PROTECTED": "",
        "surveys_processed_PROTECTED": "",
        "cnb_processed_PROTECTED": "",
        "cnb_ss_processed_PROTECTED": "",
        "eeg_processed_PROTECTED": "",
        "eeg_ss_processed_PROTECTED": "",
        "actigraphy_processed_PROTECTED": "",
        "actigraphy_ss_processed_PROTECTED": "",
        "mri_processed_PROTECTED": "",
        "mri_ss_processed_PROTECTED": "",
        "interview_audio_processed_PROTECTED": "",
        "interview_video_processed_PROTECTED": "",
        "interview_transcript_processed_PROTECTED": "",
        "interview_ss_processed_PROTECTED": "",
        "mind_phone_processed_PROTECTED": "",
        "mind_sensor_processed_PROTECTED": "",
        "mind_ss_processed_PROTECTED": "",
        "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
      },
      {
        "_id": new ObjectId("62b5d5213394ef5768b0cf75"),
        "day": 3,
        "reftime": "",
        "timeofday": "",
        "weekday": "",
        "subject_id": "YA00015",
        "site": "YA",
        "mtime": "2022-05-06",
        "surveys_processed_GENERAL": "",
        "surveys_raw_PROTECTED": 1,
        "cnb_processed_GENERAL": "",
        "cnb_raw_PROTECTED": 1,
        "cnb_ss_processed_GENERAL": "",
        "cnb_ss_raw_PROTECTED": 1,
        "eeg_processed_GENERAL": "",
        "eeg_raw_PROTECTED": "",
        "eeg_ss_processed_GENERAL": "",
        "eeg_ss_raw_PROTECTED": "",
        "actigraphy_processed_GENERAL": "",
        "actigraphy_raw_PROTECTED": "",
        "actigraphy_ss_processed_GENERAL": "",
        "actigraphy_ss_raw_PROTECTED": 1,
        "mri_processed_GENERAL": "",
        "mri_raw_PROTECTED": "",
        "mri_ss_processed_GENERAL": "",
        "mri_ss_raw_PROTECTED": "",
        "interview_audio_processed_GENERAL": 1,
        "interview_audio_raw_PROTECTED": "",
        "interview_video_processed_GENERAL": 1,
        "interview_video_raw_PROTECTED": "",
        "interview_transcript_processed_GENERAL": 1,
        "interview_transcript_raw_PROTECTED": "",
        "interview_ss_processed_GENERAL": "",
        "interview_ss_raw_PROTECTED": "",
        "mind_phone_processed_GENERAL": "",
        "mind_phone_raw_PROTECTED": 1,
        "mind_sensor_processed_GENERAL": "",
        "mind_sensor_raw_PROTECTED": 2,
        "mind_ss_processed_GENERAL": "",
        "mind_ss_raw_PROTECTED": 1,
        "surveys_processed_PROTECTED": "",
        "cnb_processed_PROTECTED": "",
        "cnb_ss_processed_PROTECTED": "",
        "eeg_processed_PROTECTED": "",
        "eeg_ss_processed_PROTECTED": "",
        "actigraphy_processed_PROTECTED": "",
        "actigraphy_ss_processed_PROTECTED": "",
        "mri_processed_PROTECTED": "",
        "mri_ss_processed_PROTECTED": "",
        "interview_audio_processed_PROTECTED": "",
        "interview_video_processed_PROTECTED": "",
        "interview_transcript_processed_PROTECTED": "",
        "interview_ss_processed_PROTECTED": "",
        "mind_phone_processed_PROTECTED": "",
        "mind_sensor_processed_PROTECTED": "",
        "mind_ss_processed_PROTECTED": "",
        "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
      },
      {
        "_id": new ObjectId("62b5d5213394ef5768b0cf76"),
        "day": 4,
        "reftime": "",
        "timeofday": "",
        "weekday": "",
        "subject_id": "WU00085",
        "site": "WU",
        "mtime": "2022-05-06",
        "surveys_processed_GENERAL": "",
        "surveys_raw_PROTECTED": 1,
        "cnb_processed_GENERAL": "",
        "cnb_raw_PROTECTED": 1,
        "cnb_ss_processed_GENERAL": "",
        "cnb_ss_raw_PROTECTED": 1,
        "eeg_processed_GENERAL": "",
        "eeg_raw_PROTECTED": "",
        "eeg_ss_processed_GENERAL": "",
        "eeg_ss_raw_PROTECTED": "",
        "actigraphy_processed_GENERAL": "",
        "actigraphy_raw_PROTECTED": 1,
        "actigraphy_ss_processed_GENERAL": "",
        "actigraphy_ss_raw_PROTECTED": 1,
        "mri_processed_GENERAL": "",
        "mri_raw_PROTECTED": "",
        "mri_ss_processed_GENERAL": "",
        "mri_ss_raw_PROTECTED": "",
        "interview_audio_processed_GENERAL": "",
        "interview_audio_raw_PROTECTED": "",
        "interview_video_processed_GENERAL": "",
        "interview_video_raw_PROTECTED": "",
        "interview_transcript_processed_GENERAL": "",
        "interview_transcript_raw_PROTECTED": "",
        "interview_ss_processed_GENERAL": "",
        "interview_ss_raw_PROTECTED": "",
        "mind_phone_processed_GENERAL": "",
        "mind_phone_raw_PROTECTED": "",
        "mind_sensor_processed_GENERAL": "",
        "mind_sensor_raw_PROTECTED": "",
        "mind_ss_processed_GENERAL": "",
        "mind_ss_raw_PROTECTED": "",
        "surveys_processed_PROTECTED": "",
        "cnb_processed_PROTECTED": "",
        "cnb_ss_processed_PROTECTED": "",
        "eeg_processed_PROTECTED": "",
        "eeg_ss_processed_PROTECTED": "",
        "actigraphy_processed_PROTECTED": "",
        "actigraphy_ss_processed_PROTECTED": "",
        "mri_processed_PROTECTED": "",
        "mri_ss_processed_PROTECTED": "",
        "interview_audio_processed_PROTECTED": "",
        "interview_video_processed_PROTECTED": "",
        "interview_transcript_processed_PROTECTED": "",
        "interview_ss_processed_PROTECTED": "",
        "mind_phone_processed_PROTECTED": "",
        "mind_sensor_processed_PROTECTED": "",
        "mind_ss_processed_PROTECTED": "",
        "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
      }
    ])

    await dataDb.createCollection('84cc7cd0e9167928f399baa3e68876ef7b6bb135de661d828201c930ae672182')

    await dataDb.collection('84cc7cd0e9167928f399baa3e68876ef7b6bb135de661d828201c930ae672182').insertMany([{
      "_id": new ObjectId("62b5d5223394ef5768b0cffc"),
      "day": 1,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "CA00063",
      "site": "CA",
      "mtime": "2022-04-26",
      "surveys_raw_PROTECTED": 1,
      "cnb_raw_PROTECTED": "",
      "cnb_ss_raw_PROTECTED": "",
      "eeg_raw_PROTECTED": 1,
      "eeg_ss_raw_PROTECTED": 1,
      "actigraphy_raw_PROTECTED": "",
      "actigraphy_ss_raw_PROTECTED": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_raw_PROTECTED": "",
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_raw_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/CA-CA00063-flowcheck-day1to1.csv"
    },
    {
      "_id": new ObjectId("62cda8ad75f0c477da93840f"),
      "day": 2,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "CA00057",
      "site": "CA",
      "mtime": "2022-04-26",
      "surveys_raw_PROTECTED": 1,
      "cnb_raw_PROTECTED": "",
      "cnb_ss_raw_PROTECTED": "",
      "eeg_raw_PROTECTED": 1,
      "eeg_ss_raw_PROTECTED": 1,
      "actigraphy_raw_PROTECTED": "",
      "actigraphy_ss_raw_PROTECTED": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_raw_PROTECTED": "",
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_raw_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/CA-CA00057-flowcheck-day1to1.csv"
    },
    {
      "_id": new ObjectId("62cda8ce75f0c477da938410"),
      "day": 3,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "CA00057",
      "site": "CA",
      "mtime": "2022-04-26",
      "surveys_raw_PROTECTED": 1,
      "cnb_raw_PROTECTED": "",
      "cnb_ss_raw_PROTECTED": "",
      "eeg_raw_PROTECTED": 1,
      "eeg_ss_raw_PROTECTED": 1,
      "actigraphy_raw_PROTECTED": "",
      "actigraphy_ss_raw_PROTECTED": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_raw_PROTECTED": "",
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_raw_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/CA-CA00057-flowcheck-day1to1.csv"
    },
    {
      "_id": new ObjectId("62e2804cf8e96ad36c8c6223"),
      "day": 1,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "CA00063",
      "site": "CA",
      "mtime": "2022-04-26",
      "surveys_raw_PROTECTED": 1,
      "cnb_raw_PROTECTED": "",
      "cnb_ss_raw_PROTECTED": "",
      "eeg_raw_PROTECTED": 1,
      "eeg_ss_raw_PROTECTED": 1,
      "actigraphy_raw_PROTECTED": "",
      "actigraphy_ss_raw_PROTECTED": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_raw_PROTECTED": "",
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_raw_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/data_for_gnar/CA-CA00063-flowcheck-day1to1.csv"
    }])
    
    const connection = await migrateAssessmentSubjectDayData();
    await connection.close()

    const assessmentSubjectDayData = await appDb.collection('assessmentSubjectDayData').find({}).toArray()

    expect(assessmentSubjectDayData.length).toBe(7)

    const assessmentSubjectRange = await appDb.collection('assessmentSubjectRange').find({}).toArray()

    expect(assessmentSubjectRange.length).toBe(2)
    
    const assessmentSubjectDayDataForToc = await appDb.collection('assessmentSubjectDayData').find({
      collection: "bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448"
    }).toArray()
    const day1 = assessmentSubjectDayDataForToc.find(d => d.day === 1)
    expect(day1).toMatchObject(
      {
        _id: day1._id,
        study: 'CA',
        subject: 'CA00007',
        assessment: 'flowcheck',
        units: 'day',
        collection: 'bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448',
        time_units: 'day',
        day: 1,
        reftime: '',
        timeofday: '',
        weekday: '',
        subject_id: 'CA00007',
        site: 'CA',
        surveys_processed_GENERAL: '',
        surveys_raw_PROTECTED: 1,
        cnb_processed_GENERAL: '',
        cnb_raw_PROTECTED: 1,
        cnb_ss_processed_GENERAL: '',
        cnb_ss_raw_PROTECTED: 1,
        eeg_processed_GENERAL: '',
        eeg_raw_PROTECTED: 1,
        eeg_ss_processed_GENERAL: '',
        eeg_ss_raw_PROTECTED: 1,
        actigraphy_processed_GENERAL: '',
        actigraphy_raw_PROTECTED: 1,
        actigraphy_ss_processed_GENERAL: '',
        actigraphy_ss_raw_PROTECTED: 1,
        mri_processed_GENERAL: '',
        mri_raw_PROTECTED: '',
        mri_ss_processed_GENERAL: '',
        mri_ss_raw_PROTECTED: '',
        interview_audio_processed_GENERAL: 1,
        interview_audio_raw_PROTECTED: '',
        interview_video_processed_GENERAL: 1,
        interview_video_raw_PROTECTED: '',
        interview_transcript_processed_GENERAL: '',
        interview_transcript_raw_PROTECTED: '',
        interview_ss_processed_GENERAL: '',
        interview_ss_raw_PROTECTED: '',
        mind_phone_processed_GENERAL: '',
        mind_phone_raw_PROTECTED: '',
        mind_sensor_processed_GENERAL: '',
        mind_sensor_raw_PROTECTED: '',
        mind_ss_processed_GENERAL: '',
        mind_ss_raw_PROTECTED: '',
        surveys_processed_PROTECTED: '',
        cnb_processed_PROTECTED: '',
        cnb_ss_processed_PROTECTED: '',
        eeg_processed_PROTECTED: '',
        eeg_ss_processed_PROTECTED: '',
        actigraphy_processed_PROTECTED: '',
        actigraphy_ss_processed_PROTECTED: '',
        mri_processed_PROTECTED: '',
        mri_ss_processed_PROTECTED: '',
        interview_audio_processed_PROTECTED: '',
        interview_video_processed_PROTECTED: '',
        interview_transcript_processed_PROTECTED: '',
        interview_ss_processed_PROTECTED: '',
        mind_phone_processed_PROTECTED: '',
        mind_sensor_processed_PROTECTED: '',
        mind_ss_processed_PROTECTED: '',
        path: '/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv',
        legacy_id: new ObjectId("62b5d5213394ef5768b0cf73"),
      }
    )

    const day4 = assessmentSubjectDayDataForToc.find(d => d.day === 4)
    expect(day4).toMatchObject(
      {
        _id: day4._id,
        study: 'CA',
        subject: 'CA00007',
        assessment: 'flowcheck',
        units: 'day',
        time_units: 'day',
        day: 4,
        reftime: '',
        timeofday: '',
        weekday: '',
        subject_id: 'WU00085',
        site: 'WU',
        surveys_processed_GENERAL: '',
        surveys_raw_PROTECTED: 1,
        cnb_processed_GENERAL: '',
        cnb_raw_PROTECTED: 1,
        cnb_ss_processed_GENERAL: '',
        cnb_ss_raw_PROTECTED: 1,
        eeg_processed_GENERAL: '',
        eeg_raw_PROTECTED: '',
        eeg_ss_processed_GENERAL: '',
        eeg_ss_raw_PROTECTED: '',
        actigraphy_processed_GENERAL: '',
        actigraphy_raw_PROTECTED: 1,
        actigraphy_ss_processed_GENERAL: '',
        actigraphy_ss_raw_PROTECTED: 1,
        mri_processed_GENERAL: '',
        mri_raw_PROTECTED: '',
        mri_ss_processed_GENERAL: '',
        mri_ss_raw_PROTECTED: '',
        interview_audio_processed_GENERAL: '',
        interview_audio_raw_PROTECTED: '',
        interview_video_processed_GENERAL: '',
        interview_video_raw_PROTECTED: '',
        interview_transcript_processed_GENERAL: '',
        interview_transcript_raw_PROTECTED: '',
        interview_ss_processed_GENERAL: '',
        interview_ss_raw_PROTECTED: '',
        mind_phone_processed_GENERAL: '',
        mind_phone_raw_PROTECTED: '',
        mind_sensor_processed_GENERAL: '',
        mind_sensor_raw_PROTECTED: '',
        mind_ss_processed_GENERAL: '',
        mind_ss_raw_PROTECTED: '',
        surveys_processed_PROTECTED: '',
        cnb_processed_PROTECTED: '',
        cnb_ss_processed_PROTECTED: '',
        eeg_processed_PROTECTED: '',
        eeg_ss_processed_PROTECTED: '',
        actigraphy_processed_PROTECTED: '',
        actigraphy_ss_processed_PROTECTED: '',
        mri_processed_PROTECTED: '',
        mri_ss_processed_PROTECTED: '',
        interview_audio_processed_PROTECTED: '',
        interview_video_processed_PROTECTED: '',
        interview_transcript_processed_PROTECTED: '',
        interview_ss_processed_PROTECTED: '',
        mind_phone_processed_PROTECTED: '',
        mind_sensor_processed_PROTECTED: '',
        mind_ss_processed_PROTECTED: '',
        path: '/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv',
        legacy_id: new ObjectId("62b5d5213394ef5768b0cf76")
      }
    )

    const day3 = assessmentSubjectDayDataForToc.find(d => d.day === 3)
    expect(day3).toMatchObject(
      {
        _id: day3._id,
        study: 'CA',
        subject: 'CA00007',
        assessment: 'flowcheck',
        units: 'day',
        time_units: 'day',
        day: 3,
        reftime: '',
        timeofday: '',
        weekday: '',
        subject_id: 'YA00015',
        site: 'YA',
        surveys_processed_GENERAL: '',
        surveys_raw_PROTECTED: 1,
        cnb_processed_GENERAL: '',
        cnb_raw_PROTECTED: 1,
        cnb_ss_processed_GENERAL: '',
        cnb_ss_raw_PROTECTED: 1,
        eeg_processed_GENERAL: '',
        eeg_raw_PROTECTED: '',
        eeg_ss_processed_GENERAL: '',
        eeg_ss_raw_PROTECTED: '',
        actigraphy_processed_GENERAL: '',
        actigraphy_raw_PROTECTED: '',
        actigraphy_ss_processed_GENERAL: '',
        actigraphy_ss_raw_PROTECTED: 1,
        mri_processed_GENERAL: '',
        mri_raw_PROTECTED: '',
        mri_ss_processed_GENERAL: '',
        mri_ss_raw_PROTECTED: '',
        interview_audio_processed_GENERAL: 1,
        interview_audio_raw_PROTECTED: '',
        interview_video_processed_GENERAL: 1,
        interview_video_raw_PROTECTED: '',
        interview_transcript_processed_GENERAL: 1,
        interview_transcript_raw_PROTECTED: '',
        interview_ss_processed_GENERAL: '',
        interview_ss_raw_PROTECTED: '',
        mind_phone_processed_GENERAL: '',
        mind_phone_raw_PROTECTED: 1,
        mind_sensor_processed_GENERAL: '',
        mind_sensor_raw_PROTECTED: 2,
        mind_ss_processed_GENERAL: '',
        mind_ss_raw_PROTECTED: 1,
        surveys_processed_PROTECTED: '',
        cnb_processed_PROTECTED: '',
        cnb_ss_processed_PROTECTED: '',
        eeg_processed_PROTECTED: '',
        eeg_ss_processed_PROTECTED: '',
        actigraphy_processed_PROTECTED: '',
        actigraphy_ss_processed_PROTECTED: '',
        mri_processed_PROTECTED: '',
        mri_ss_processed_PROTECTED: '',
        interview_audio_processed_PROTECTED: '',
        interview_video_processed_PROTECTED: '',
        interview_transcript_processed_PROTECTED: '',
        interview_ss_processed_PROTECTED: '',
        mind_phone_processed_PROTECTED: '',
        mind_sensor_processed_PROTECTED: '',
        mind_ss_processed_PROTECTED: '',
        path: '/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv',
        legacy_id: new ObjectId("62b5d5213394ef5768b0cf75")
      }
    )
  })

  it('skips tocs with duplicate collections', async () => {
    await dataDb.createCollection('toc') 

    await dataDb.collection('toc').insertMany([
      {
        "_id": new ObjectId("62b5d5223394ef5768b0cffd"),
        "study": "CA",
        "subject": "CA00007",
        "assessment": "flowcheck",
        "units": "day",
        "start": "1",
        "end": "1",
        "extension": ".csv",
        "glob": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day*.csv",
        "collection": "test_collection",
        "time_units": "day",
        "time_start": 1,
        "time_end": 1,
        "path": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day1to1.csv",
        "filetype": "text/csv",
        "encoding": null,
        "basename": "CA-CA00007-flowcheck-day1to1.csv",
        "dirname": "/Users/ivanrts/Downloads/test_data",
        "dirty": false,
        "synced": true,
        "mtime": 1654738581,
        "size": 958,
        "uid": 501,
        "gid": 20,
        "mode": 33252,
        "role": "data",
        "updated": new Date("2022-06-24T15:15:46.542Z"),
      },
      {
        "_id": new ObjectId("62b5d5223394ef5768b0cffb"),
        "study": "CA",
        "subject": "CA00063",
        "assessment": "flowcheck",
        "units": "day",
        "start": "1",
        "end": "1",
        "extension": ".csv",
        "glob": "/Users/ivanrts/Downloads/test_data/CA-CA00063-flowcheck-day*.csv",
        "collection": "test_collection",
        "time_units": "day",
        "time_start": 1,
        "time_end": 1,
        "path": "/Users/ivanrts/Downloads/test_data/CA-CA00063-flowcheck-day1to1.csv",
        "filetype": "text/csv",
        "encoding": null,
        "basename": "CA-CA00063-flowcheck-day1to1.csv",
        "dirname": "/Users/ivanrts/Downloads/test_data",
        "dirty": false,
        "synced": true,
        "mtime": 1654738584,
        "size": 485,
        "uid": 501,
        "gid": 20,
        "mode": 33252,
        "role": "data",
        "updated": new Date("2022-06-24T15:15:46.423Z")
      }
  ])

  await dataDb.createCollection('test_collection')

  await dataDb.collection('test_collection').insertMany([
    {
      "_id": new ObjectId("62b5d5213394ef5768b0cf73"),
      "day": 1,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "CA00007",
      "site": "CA",
      "mtime": "2022-05-06",
      "surveys_processed_GENERAL": "",
      "surveys_raw_PROTECTED": 1,
      "cnb_processed_GENERAL": "",
      "cnb_raw_PROTECTED": 1,
      "cnb_ss_processed_GENERAL": "",
      "cnb_ss_raw_PROTECTED": 1,
      "eeg_processed_GENERAL": "",
      "eeg_raw_PROTECTED": 1,
      "eeg_ss_processed_GENERAL": "",
      "eeg_ss_raw_PROTECTED": 1,
      "actigraphy_processed_GENERAL": "",
      "actigraphy_raw_PROTECTED": 1,
      "actigraphy_ss_processed_GENERAL": "",
      "actigraphy_ss_raw_PROTECTED": 1,
      "mri_processed_GENERAL": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_processed_GENERAL": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_processed_GENERAL": 1,
      "interview_audio_raw_PROTECTED": "",
      "interview_video_processed_GENERAL": 1,
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_processed_GENERAL": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_processed_GENERAL": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_processed_GENERAL": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_processed_GENERAL": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_processed_GENERAL": "",
      "mind_ss_raw_PROTECTED": "",
      "surveys_processed_PROTECTED": "",
      "cnb_processed_PROTECTED": "",
      "cnb_ss_processed_PROTECTED": "",
      "eeg_processed_PROTECTED": "",
      "eeg_ss_processed_PROTECTED": "",
      "actigraphy_processed_PROTECTED": "",
      "actigraphy_ss_processed_PROTECTED": "",
      "mri_processed_PROTECTED": "",
      "mri_ss_processed_PROTECTED": "",
      "interview_audio_processed_PROTECTED": "",
      "interview_video_processed_PROTECTED": "",
      "interview_transcript_processed_PROTECTED": "",
      "interview_ss_processed_PROTECTED": "",
      "mind_phone_processed_PROTECTED": "",
      "mind_sensor_processed_PROTECTED": "",
      "mind_ss_processed_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
    },
    {
      "_id": new ObjectId("62b5d5213394ef5768b0cf75"),
      "day": 3,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "YA00015",
      "site": "YA",
      "mtime": "2022-05-06",
      "surveys_processed_GENERAL": "",
      "surveys_raw_PROTECTED": 1,
      "cnb_processed_GENERAL": "",
      "cnb_raw_PROTECTED": 1,
      "cnb_ss_processed_GENERAL": "",
      "cnb_ss_raw_PROTECTED": 1,
      "eeg_processed_GENERAL": "",
      "eeg_raw_PROTECTED": "",
      "eeg_ss_processed_GENERAL": "",
      "eeg_ss_raw_PROTECTED": "",
      "actigraphy_processed_GENERAL": "",
      "actigraphy_raw_PROTECTED": "",
      "actigraphy_ss_processed_GENERAL": "",
      "actigraphy_ss_raw_PROTECTED": 1,
      "mri_processed_GENERAL": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_processed_GENERAL": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_processed_GENERAL": 1,
      "interview_audio_raw_PROTECTED": "",
      "interview_video_processed_GENERAL": 1,
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_processed_GENERAL": 1,
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_processed_GENERAL": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_processed_GENERAL": "",
      "mind_phone_raw_PROTECTED": 1,
      "mind_sensor_processed_GENERAL": "",
      "mind_sensor_raw_PROTECTED": 2,
      "mind_ss_processed_GENERAL": "",
      "mind_ss_raw_PROTECTED": 1,
      "surveys_processed_PROTECTED": "",
      "cnb_processed_PROTECTED": "",
      "cnb_ss_processed_PROTECTED": "",
      "eeg_processed_PROTECTED": "",
      "eeg_ss_processed_PROTECTED": "",
      "actigraphy_processed_PROTECTED": "",
      "actigraphy_ss_processed_PROTECTED": "",
      "mri_processed_PROTECTED": "",
      "mri_ss_processed_PROTECTED": "",
      "interview_audio_processed_PROTECTED": "",
      "interview_video_processed_PROTECTED": "",
      "interview_transcript_processed_PROTECTED": "",
      "interview_ss_processed_PROTECTED": "",
      "mind_phone_processed_PROTECTED": "",
      "mind_sensor_processed_PROTECTED": "",
      "mind_ss_processed_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
    },
    {
      "_id": new ObjectId("62b5d5213394ef5768b0cf76"),
      "day": 4,
      "reftime": "",
      "timeofday": "",
      "weekday": "",
      "subject_id": "WU00085",
      "site": "WU",
      "mtime": "2022-05-06",
      "surveys_processed_GENERAL": "",
      "surveys_raw_PROTECTED": 1,
      "cnb_processed_GENERAL": "",
      "cnb_raw_PROTECTED": 1,
      "cnb_ss_processed_GENERAL": "",
      "cnb_ss_raw_PROTECTED": 1,
      "eeg_processed_GENERAL": "",
      "eeg_raw_PROTECTED": "",
      "eeg_ss_processed_GENERAL": "",
      "eeg_ss_raw_PROTECTED": "",
      "actigraphy_processed_GENERAL": "",
      "actigraphy_raw_PROTECTED": 1,
      "actigraphy_ss_processed_GENERAL": "",
      "actigraphy_ss_raw_PROTECTED": 1,
      "mri_processed_GENERAL": "",
      "mri_raw_PROTECTED": "",
      "mri_ss_processed_GENERAL": "",
      "mri_ss_raw_PROTECTED": "",
      "interview_audio_processed_GENERAL": "",
      "interview_audio_raw_PROTECTED": "",
      "interview_video_processed_GENERAL": "",
      "interview_video_raw_PROTECTED": "",
      "interview_transcript_processed_GENERAL": "",
      "interview_transcript_raw_PROTECTED": "",
      "interview_ss_processed_GENERAL": "",
      "interview_ss_raw_PROTECTED": "",
      "mind_phone_processed_GENERAL": "",
      "mind_phone_raw_PROTECTED": "",
      "mind_sensor_processed_GENERAL": "",
      "mind_sensor_raw_PROTECTED": "",
      "mind_ss_processed_GENERAL": "",
      "mind_ss_raw_PROTECTED": "",
      "surveys_processed_PROTECTED": "",
      "cnb_processed_PROTECTED": "",
      "cnb_ss_processed_PROTECTED": "",
      "eeg_processed_PROTECTED": "",
      "eeg_ss_processed_PROTECTED": "",
      "actigraphy_processed_PROTECTED": "",
      "actigraphy_ss_processed_PROTECTED": "",
      "mri_processed_PROTECTED": "",
      "mri_ss_processed_PROTECTED": "",
      "interview_audio_processed_PROTECTED": "",
      "interview_video_processed_PROTECTED": "",
      "interview_transcript_processed_PROTECTED": "",
      "interview_ss_processed_PROTECTED": "",
      "mind_phone_processed_PROTECTED": "",
      "mind_sensor_processed_PROTECTED": "",
      "mind_ss_processed_PROTECTED": "",
      "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv"
    }
  ])

  const connection = await migrateAssessmentSubjectDayData();
  await connection.close()

  const assessmentSubjectDayData = await appDb.collection('assessmentSubjectDayData').find({}).toArray()

  expect(assessmentSubjectDayData.length).toBe(3)

  })
})