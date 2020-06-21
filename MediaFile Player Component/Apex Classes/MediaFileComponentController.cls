public class MediaFileComponentController {
    
    static string BASE_URL='/sfc/servlet.shepherd/document/download/';
    
    
    public class MediaFileWrapper{
        @AuraEnabled public string name;
        @AuraEnabled public string url;
        @AuraEnabled public string type;
    }
    static Map<String,String> fileExtensionToTypeMap = new Map<String,String>{
        'MP4' => 'Video',
        'MP3' => 'Audio',
        'WAV' => 'Audio'
    }; // We can move this to CMDT
    
    @AuraEnabled
    public static mediaFileWrapper[] getRelatedMediaFiles(string recordId){
        
        mediaFileWrapper[] mediaFileList = new mediaFileWrapper[]{};
        Set<id> ContentDocumentIds = new Set<id>();
        for(ContentDocumentLink cdl :  [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId=:recordId]){
            ContentDocumentIds.add(cdl.contentdocumentId);
        }    
        ContentDocument[] contentDocList = [
            SELECT Id,Title,FileType,FileExtension 
            FROM ContentDocument 
            WHERE Id IN :ContentDocumentIds
              AND FileType IN :fileExtensionToTypeMap.keySet()
        ];
        
        for(ContentDocument cd : contentDocList){
            mediaFileWrapper file = new mediaFileWrapper();
            file.name=cd.Title;
            file.url=BASE_URL+cd.Id;
            file.type = fileExtensionToTypeMap.get(cd.FileType);
            mediaFileList.add(file);
        }
        return mediaFileList;
    }

}