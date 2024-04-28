import readline from 'readline';
export default async function input(message:string=""): Promise<any>{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let result:any = await new Promise((resolve, reject) =>{
        rl.question(message, (data:any) => {
            resolve(data);
            rl.close();
        });
    })
    try {rl.close();} catch (error) {}
    return result;
}