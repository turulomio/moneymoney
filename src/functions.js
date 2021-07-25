import moment from 'moment';
import axios from 'axios'



export function age_today(birth_iso_string) {
    return age_in_a_date(birth_iso_string, new Date().toISOString())
}

export function age_in_a_date(birth_iso_string, date_iso_string) {
    //The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 
    // ~~ Math.floor  
    var birth = new Date(birth_iso_string)
    var date = new Date(date_iso_string)
    if (birth.getDate()==date.getDate() && birth.getMonth()==date.getMonth()){ // To avoid decimal errors in birthday
        return date.getFullYear()-birth.getFullYear()
    } else {
        return ~~((date - birth ) / (31557600000));
    }
}

export function fullName(person){
    return `${person.name} ${person.surname} ${person.surname2}`
}

export function localtime(value){
    if (value){
        var dateFormat = 'YYYY-MM-DD HH:mm:ss';
        var testDateUtc = moment.utc(value);
        var localDate = testDateUtc.local();
        return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
    }
    console.log("REALLY");
    return null;
}   

export function moment_day_start(isostring){
    if (isostring){
        var testDateUtc = moment.utc(isostring);
        var localDate = testDateUtc.local();
        return localDate
    }
    console.log("REALLY");
    return null;
}   


export function AddressTypeName(value){
    var retypes=this.$store.state.catalogs.addresstype.find(t => t.value==value);
    return retypes.display_name;
}

export function CountryName(value){
    var retypes=this.$store.state.catalogs.countries.find(t => t.value==value);
    return retypes.display_name;
}

export function MailTypeName(value){
    var retypes=this.$store.state.catalogs.mailtype.find(t => t.value==value);
    return retypes.display_name;
}

export function LogTypeName(value){
    var retypes=this.$store.state.catalogs.logtype.find(t => t.value==value);
    return retypes.display_name;
}

export function PhoneTypeName(value){
    var retypes=this.$store.state.catalogs.phonetype.find(t => t.value==value);
    return retypes.display_name;
}

export function RelationshipTypeName(value){
    var retypes=this.$store.state.catalogs.relationshiptype.find(t => t.value==value);
    return retypes.display_name;
}

export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${this.$store.state.token}`,
            'Accept-Language': `${this.$i18n.locale}-${this.$i18n.locale}`,
            'Content-Type':'application/json'
        }
    }
}
export function myheaders_formdata(){
    return {
        headers:{
            'Authorization': `Token ${this.$store.state.token}`,
            'Accept-Language': `${this.$i18n.locale}-${this.$i18n.locale}`,
            'Content-Type': 'multipart/form-data'
        }
    }
}

export function vuex_update_catalogs(){   
    axios.options(`${this.$store.state.apiroot}/api/persons/`, this.myheaders())
    .then((response) => {
        this.$store.state.catalogs.persongender= sortObjectsArray(response.data.actions.POST.gender.choices, "display_name")
        this.$store.state.catalogs.countries= sortObjectsArray(response.data.actions.POST.address.child.children.country.choices, "display_name")
        this.$store.state.catalogs.addresstype= sortObjectsArray(response.data.actions.POST.address.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.mailtype= sortObjectsArray(response.data.actions.POST.mail.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.phonetype= sortObjectsArray(response.data.actions.POST.phone.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.logtype= sortObjectsArray(response.data.actions.POST.log.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.relationshiptype=sortObjectsArray(response.data.actions.POST.relationship.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.mimetype= sortObjectsArray(response.data.actions.POST.blob.child.children.mime.choices, "display_name")
        console.log("Updated catalogs")
        return
    }, (error) => {
        this.parseResponseError(error)
    });
}

export function logout(){
    const formData = new FormData();
    formData.append('key', this.$store.state.token);
    axios.post(`${this.$store.state.apiroot}/logout/`, formData)
    .then((response) => {
        console.log(response.data);
        this.$store.state.token=null;
        this.$store.state.logged=false;
    }, (error) => {
        this.parseResponseError(error)
        });
}

export function sortObjectsArray(objectsArray, sortKey)
{
    // Quick Sort:
    var retVal;

    if (1 < objectsArray.length)
    {
        var pivotIndex = Math.floor((objectsArray.length - 1) / 2);  // middle index
        var pivotItem = objectsArray[pivotIndex];                    // value in the middle index
        var less = [], more = [];

        objectsArray.splice(pivotIndex, 1);                          // remove the item in the pivot position
        objectsArray.forEach(function(value)
        {
            value[sortKey] <= pivotItem[sortKey] ?                   // compare the 'sortKey' proiperty
                less.push(value) :
                more.push(value) ;
        });

        retVal = sortObjectsArray(less, sortKey).concat([pivotItem], sortObjectsArray(more, sortKey));
    }
    else
    {
        retVal = objectsArray;
    }
    
    return retVal;
}

// returns true if everything is ok
// return false if there is something wrong
export function parseResponse(response){
    if (response.status==200){ //Good connection
        if (response.data == "Invalid user" || response.data == "Wrong password"){
            this.$store.state.token=null;
            this.$store.state.logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push("home")
            alert(response.data)
            return false
        }
        return true
    } else if (response.status==201){// Created
        
    } else if (response.status==204){// Deleted
        
    } else {
        alert (`${response.status}: ${response.data}`)
        return false
    }
}

export function getLocalStorage(key, default_){
    if (localStorage.getItem(key)){
        return localStorage.getItem(key)
    } else {
        return default_
    }
    
}

export function parseResponseError(error){
    if (error.response) {
      // Request made and server responded
        console.log("made and responded")
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
        if (error.response.status == 401){
            alert (this.$t("You aren't authorized to do this request"))
            this.$store.state.token=null;
            this.$store.state.logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push("home")
            console.log(error.response)
        } else if (error.response.status == 500){
            alert (this.$t("There is a server error"))
            console.log(error.response)
        } else {
            alert (this.$t("Unknown error"))
            
        }
        
    } else if (error.request) {
        console.log("The request was made but no response was received")
        alert (this.$t("Server couldn't answer this request"))
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
        console.log("OTROS")
        console.log('Error', error.message);
    }
}

export function arrayobjects_to_stringofstrings(l, key){
    var s=""
    l.forEach(o => s=s+o[key].toString() + ", ")
    return s.slice(0,-2)
}
