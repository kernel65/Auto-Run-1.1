export const FILE_PATH = `${overwolf.io.paths.documents}\\OverwolfAutopath\\position.pos`;


export function parseSyncWord(line: string, separator: string): string{
    let str = '';
   
    try{
        const parts = line.trim().split(separator);
        str = parts[parts.length - 1].trim();
    }
    catch (e){
        console.log('Exception!' + e);
    }

   return str;
}


export function writeFileSync(file_path: string, data: string){
    console.log('Inside writeFile');
    
    function callback(){
        console.log('Inside Callback');
    }
    
    overwolf.io.writeFileContents(
        file_path, 
        data, 
        overwolf.io.enums.eEncoding.ASCII,
        true,
        callback    
    );
}




export function readFileSync(file_path: string): string{    
    let data;
   
    function callback(res: overwolf.io.ReadFileContentsResult){
        data = res.content;
        return res;
    }
    
    console.log('Перед вызовом readFileContents');
    overwolf.io.readFileContents(
        file_path,
        overwolf.io.enums.eEncoding.ASCII,
        res => callback(res)
    )
    
    console.log('Возврат данных data = ' + data);
    return data;
}


export async function writeFile(content: string) {
    const result = await new Promise((resolve, reject) => {
      overwolf.io.writeFileContents(
        FILE_PATH,
        content,
        overwolf.io.enums.eEncoding.ASCII,
        true,
        r => r.success ? resolve(r) : reject(r)
      );
    });
  
    console.log('writeFile()', result);
  
    return result;
  }


export async function readFile() {   
    const result = await new Promise(resolve => {
      overwolf.io.readFileContents(
        FILE_PATH,
        overwolf.io.enums.eEncoding.ASCII,
        resolve
      );
    }); 
    
    return (result as overwolf.io.ReadFileContentsResult).content;
}
