import {isNumber,upperFirst,round,sumBy} from "lodash-es"
import {currency_string, percentage_string} from '@/functions.js'

export function pdfmake_convertImageToDataURL(url){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = url;
    });
  }


  export function pdfmake_loo_to_table_guess_headers(loo, keys_array){
    /**
     * Returns an array with all headers as object
     * {
     *      key
     *      name
     *      decimals
     *      alignment
     *      currency_column  EUR %, USD...
     *      currency_row_key  key in row where must get curtrency value
     *      total
     *      width
     * }
     */

    var headers=[]
    keys_array.forEach( key => {
        let alignment="left"
        if (key.currency_column=="%"){
            alignment="right"
        } else if (isNumber(loo[0][key])){
            alignment="right"
        }

        headers.push({
            key:key,
            title: upperFirst(key),
            decimals: 2,
            currency_column: null,
            currency_row_key:null,
            alignment: alignment,
            total: null,
            width: "*"
        })
    })

    return headers
}

export function pdfmake_loo_to_table(loo,headers,style){
    /**
     * widths: // widths: ['*', 'auto', 100, '*'],
     */
    var body=[]
    // Adding headers
    var row=[]
    
    var widths=[]


    headers.forEach(header=>{
        row.push({text:header.title,fillColor:'#888888', bold:true, alignment:"center"})
        widths.push(header.width)
    })
    body.push(row)
    loo.forEach(o => {
        row=[]
        headers.forEach(header => {
            let color="black"
            let value=o[header.key]
            if (isNumber(o[header.key])){
                if (o[header.key]<0){
                    color="red"
                }
                if( header.currency_column && header.currency_column=="%"){
                    value=percentage_string(o[header.key],header.decimals)
                } else  if( header.currency_column){
                    value=currency_string(o[header.key],header.currency_column,header.decimals)
                } else  if( header.currency_row_key){
                    value=currency_string(o[header.key], o[header.currency_row_key],header.decimals)
                } else {
                    value=round(o[header.key], header.decimals)
                }
            }
            row.push({ text:value, alignment: header.alignment, color:color}) 
        })
        body.push(row)
    })


    // Checks if some header has total
    let showtotal=false
    headers.forEach(header => {
        if (header.total){
            showtotal=true
        }
    })

    if (showtotal){
        row=[]
        headers.forEach(header =>{
            if (header.total==null){
                row.push({text:"", fillColor:"#CCCCCC"})
            } else if (header.total=="#SUM" && header.currency_column){
                row.push({text:currency_string(sumBy(loo,header.key), header.currency_column,header.decimals), fillColor:"#CCCCCC", alignment:header.alignment})
            } else {
                row.push({text: header.total, fillColor:"#CCCCCC"})
            }
        })
        body.push(row)
    }


    var r={ 
            table: {
                headerRows: 1,
                widths:widths,
                body: body
            },
            style: style,
        }
    console.log(r)
    return r
}


export function pdfmake_percentage_string(num, decimals){
    if (num==null || isNaN(num)) return "- - - %"
    if (num>=0){
        return {text:`${round(num*100,decimals).toLocaleString(localStorage.locale,{ minimumFractionDigits: decimals,  })} %`}
    } else {
        return {text:`${round(num*100,decimals).toLocaleString(localStorage.locale,{ minimumFractionDigits: decimals,  })} %`, color:"red"}

    }
}

