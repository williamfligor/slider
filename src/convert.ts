import * as fileUpload from 'express-fileupload';
import * as imagemagick from 'imagemagick';
import * as fs from 'fs';
import * as path from 'path';

export const SLIDES_DIR = __dirname + '/../data/slides';

async function moveFile(file: fileUpload.UploadedFile) {
    return new Promise((resolve, reject) => {
        file.mv(SLIDES_DIR + '/presentation.pdf', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

async function convertFile() {
    return new Promise((resolve, reject) => {
        const cmd = [SLIDES_DIR + '/presentation.pdf', '-density', 300, '-quality', 100, SLIDES_DIR + '/presentation-%02d.jpg'];

        console.debug(`Running imagemagick with "${cmd.join(' ')}"`);
        imagemagick.convert(cmd, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
            
            console.debug('imagemagick done');
        });
    })
}

async function deleteFile(fname: string) : Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(fname, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

export async function listFiles(directory : string) : Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(SLIDES_DIR, (err, fileNames) => {
            if (err) {
                reject(err);
            } else {
                resolve(fileNames);
            }
        });
    });
}

async function deleteExistingFiles() {
    const files = await listFiles(SLIDES_DIR);

    for (const fname of files) {
        if (fname.startsWith('presentation-')) {
            await deleteFile(SLIDES_DIR + '/' + fname);

            console.debug('deleted', fname)
        }
    }

}

export async function pdfToImages(file: fileUpload.UploadedFile[] | fileUpload.UploadedFile) {
    if (Array.isArray(file)) {
        file = file[0];
    }

    await deleteExistingFiles();

    await moveFile(file);
    await convertFile();
}
