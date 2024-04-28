async function ReadJSON(URL) {
    const response = await fetch(URL);
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
    return await response.json();
}


/**
 * Note that the alert function is a blocking function, so it will stop the execution of the code until the user closes the alert window.
 * @param {*} message 
 * @returns 
 */
function showAlert(message) {
    return new Promise(resolve => {
      setTimeout(() => {
        alert(message);
        resolve();
      }, 0);
    });
  }

const log = new Proxy({
    hidden:[],
    noRepeat:{},
    list:{},
    all:false,
},{
    get:(obj, props)=>{
        obj.list[props] = "";
        if (props == "get") { 
            setTimeout(()=>{
                console.warn(Object.keys(obj.list)); 
                return Object.keys(obj.list)
            }, 100);
        }
        if (props.includes('init')) {
            if (obj.noRepeat[props]==undefined) {
                obj.noRepeat[props] = true;
            }else if (obj.noRepeat[props]==true) {
                return ()=>{return false};
            }
        }
        if (obj.hidden.includes(props) || obj.all) {
            return ()=>{return false};
        }
        return (...args)=>{
            console.log(`[${props}]>`, ...args); 
            return true
        };
    },
    set:(obj, props, value)=>{
        if (props == "hidden") { obj.hidden.push(...value);}
        if (props == "all") { obj.all = value; }
        return true;
    }
})




export {ReadJSON, showAlert, log}