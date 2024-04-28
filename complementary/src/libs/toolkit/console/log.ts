
/**
 * Config object to log all console.log calls
 */
const config = [];

interface ProxyHandler<T extends object> {
    get?(target: T, property: string, receiver: any): any;
    set?(target: T, property: string, value: any, receiver: any): boolean;
    // otros métodos del handler
}
  
type Proxy<T extends object> = {
    [K in keyof T]: T[K]
} & {
    [key: string]: any
}
  

interface ConfigObject {
    hidden: string[];
    list: Record<string, unknown>;
    all: any;
    focus: any;
    focused: any[];
}

const object:ConfigObject = {
    hidden:[...config],
    list:{},
    all:false,
    focus:[],
    focused:[]
}

function createProxy<T extends object>(target: T, handler: ProxyHandler<T>): Proxy<T> {
    return new Proxy(target, handler) as Proxy<T>;
}

const handler: ProxyHandler<typeof object> = {
    get:(obj, props:string)=>{
        obj.list[props] = "";
        if (props == "get") {setTimeout(()=>{
            console.warn(Object.keys(obj.list)); 
            return Object.keys(obj.list)}, 100);
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
        if (props == "focus") { obj.focus = value;}
        if (props == "hidden") { obj.hidden.push(...value);}
        if (props == "all") { obj.all = value; }
        return true;
    }
}

const log = createProxy(object, handler); 
/**
 * log.[your type console log here]("your message here")
 * 
 * Log.hidden = ["your type console log here 1", "your type console log here 2"]
 * 
 * Log.all = true //is to show or hidden all console.log
 * 
 * Log.focus = ["your type console log here 1", "your type console log here 2"]
 * 
 * Log.get //to get all console.log type
 * 
 * @description Proxy object to log all console.log calls
 * @param object
 */
export default log;