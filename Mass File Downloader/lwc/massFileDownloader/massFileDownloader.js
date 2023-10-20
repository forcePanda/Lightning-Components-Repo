import { LightningElement, wire } from 'lwc';
import getFiles from '@salesforce/apex/MassFileDownloaderController.getFiles';

const COLUMNS = [
    {
        label: 'Title',
        fieldName: 'Id',
        type: 'url',
        typeAttributes: { 
            label: { fieldName: 'Title' },
            target : '_blank'
        }
    },
    {
        label: 'Type',
        fieldName: 'FileExtension',
        type: 'text'
    }
];

const BASE_DOWNLOAD_PATH = '/sfc/servlet.shepherd/version/download';

export default class MassFileDownloader extends LightningElement {
    
    columns = COLUMNS;
    downloadString = '';

    @wire(getFiles) files;

    downloadFiles() {

        let selectedFiles = this.getSelectedRows();

        if(selectedFiles.length === 0) {
            alert('No files selected');
            return;
        }

        this.initDownloading(
            this.getDownloadString(selectedFiles)
        );
    }

    handleRowSelection(event) {
        let selectedFiles = event.detail.selectedRows;
        this.downloadString = this.getDownloadString(selectedFiles);
    }

    getDownloadString(files) {
        let downloadString = '';
        files.forEach(item => {
            downloadString += '/' + item.LatestPublishedVersionId
        });
        return downloadString;
    }

    get downloadUrl() {
        return BASE_DOWNLOAD_PATH + this.downloadString;
    }

    initDownloading() {
        if (this.downloadString === '') {
            alert('No files selected');
            return;
        }
        //alert(this.downloadUrl);
        window.open(this.downloadUrl, '_blank');
    }

    getSelectedRows() {
        return this.template.querySelector('lightning-datatable').getSelectedRows(); 
    }
}
