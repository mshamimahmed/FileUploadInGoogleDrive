import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { Gdrive } from '../model/gdrive.entity';
import { GdriveDto } from '../model/gdrive.dto';
import  store  from 'data-store';
@Injectable()
export class GdriveService {
    constructor(
        @InjectRepository(Gdrive)
        private readonly gdriveRepository: Repository<Gdrive>
    ) { }
    async updateGmail(id: number, gdrive: GdriveDto):Promise<UpdateResult | null> {
        console.log(id)
        console.log(gdrive)
        return await this.gdriveRepository.update(id,{...gdrive });
    };
    async create(attachment, gdrive: GdriveDto): Promise<any> {        
        try {
            
            const ab= await  this.gDriveUpload(attachment);
            console.log(ab)
            setTimeout(()=>{
                return this.saveGdrive(gdrive)
            },20000)
            return  
        } catch (error) {
            console.log(error)
        }
      
      
        
        // from(this.gdriveRepository.save(gdrive));
    }

    gDriveUpload(attachment){
        const fs = require('fs');
        const readline = require('readline');
        const { google } = require('googleapis');

        // If modifying these scopes, delete token.json.
        const SCOPES = ['https://www.googleapis.com/auth/drive'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = 'token.json';

        // Load client secrets from a local file.
        return fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
           return authorize(JSON.parse(content), listFiles);
        });

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            return fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getAccessToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error retrieving access token', err);
                    oAuth2Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                });
            });
        }

        /**
         * Lists the names and IDs of up to 10 files.
         * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
         */
        function listFiles(auth) {
            const drive = google.drive({version: 'v3', auth})
            const fileMetadata = {
                'name': attachment.originalname
            }; 
            const media = { 
                mimeType: 'image/jpeg',
                body: fs.createReadStream(`files/${attachment.originalname}`)
            };
            const data =drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            }, (err, file) => {
                if (err) {
                // Handle error
                console.error(err); 
                } else {
                    const  data={"FileId":file.data.id}
                    fs.writeFileSync('Gdrive.json',JSON.stringify(data));                    // this.FileId=file.data.id
                
                   console.log(file.data.id)
                    //  return file.data.id             
                }
            })
            
        }
    }
    async saveGdrive(gdrive:GdriveDto):Promise<GdriveDto>{
        const fs = require('fs');
       
            return await fs.readFile('Gdrive.json', async (err, result) => {
                if (err) return console.log('Error something went wrong:', err);
                console.log('result')
                const FileGdriveId=JSON.parse(result)
                gdrive.fileId=FileGdriveId.FileId

                try {
                    return await this.gdriveRepository.save({
                        firstName:gdrive.firstName,
                        lastName:gdrive.lastName,
                        gmail:gdrive.gmail,
                        fileId:FileGdriveId.FileId, 
                    })
                } catch (error) {
                    console.log(error)
                }          
                 
              
            })
    }

    watchGmail():Promise<any>{
         const a =this.detectGmail()
         console.log(a);
         return  
    }
    detectGmail(){
        const fs = require('fs');
        const readline = require('readline');
        const {google} = require('googleapis');
        
        // If modifying these scopes, delete token.json.
        const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = 'token1.json';
        
        // Load client secrets from a local file.
        fs.readFile('credentials1.json', (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          // Authorize a client with credentials, then call the Gmail API.
          authorize(JSON.parse(content), listLabels);
        });
        
        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
          const {client_secret, client_id, redirect_uris} = credentials.installed;
          const oAuth2Client = new google.auth.OAuth2(
              client_id, client_secret, redirect_uris[0]);
        
          // Check if we have previously stored a token.
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
          });
        }
        
        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getNewToken(oAuth2Client, callback) {
          const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
          });
          console.log('Authorize this app by visiting this url:', authUrl);
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
              if (err) return console.error('Error retrieving access token', err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
              });
              callback(oAuth2Client);
            });
          });
        }
        
        /**
         * Lists the labels in the user's account.
         *
         * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
         */
        function listLabels(auth) {
          const gmail = google.gmail({version: 'v1', auth});
          gmail.users.watch.list({
            userId: 'me', 
          }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const messages = res.data;
            console.log(messages)
            
          });
        }
    }
}
