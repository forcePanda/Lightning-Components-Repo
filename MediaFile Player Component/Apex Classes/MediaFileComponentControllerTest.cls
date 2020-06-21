@isTest
public with sharing class MediaFileComponentControllerTest {
    
    @testSetup
    static void createData(){
        Account acc = new Account(
            Name = 'DemoAccount'
        );
        insert acc;
        ContentVersion cvMediaFile = new ContentVersion(
            Title = 'Demo AudioFile',
            VersionData = Blob.valueOf('RandomString'),
            PathOnClient = 'DemoAccounts.mp3'
        );
        insert cvMediaFile;
        String contentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cvMediaFile.Id].ContentDocumentId;

        ContentDocumentLink cdl = new ContentDocumentLink(
            LinkedEntityId = acc.Id,
            ContentDocumentId = contentDocumentId
        );
        insert cdl;
    }

    @isTest
    static void testGetRelatedMediaFilesMethod() {
        String relatedRecordId = [SELECT Id FROM Account WHERE Name = 'DemoAccount'].Id;
        Test.startTest();
        MediaFileComponentController.MediaFileWrapper[] mediaFileList = MediaFileComponentController.getRelatedMediaFiles(relatedRecordId);
        Test.stopTest();

        System.assert(mediaFileList.size() == 1,'File list size mismatch. Expected list size: 1');
        System.assert(mediaFileList[0].type == 'Audio','FileType mismatch. Expected file type: Audio');
    }

}