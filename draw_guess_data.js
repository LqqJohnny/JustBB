var draw_guess_data = {
    data:{},/* {creator : guest }*/
    addGuest:function(name,value){
        if(typeof this.data[name]!='undefined' && this.data[name]!=""){
            return false;
        }else{
            this.data[name]=value || "";
            return true;
        }
    },
    deleteGuest:function(name){
        if(typeof this.data[name] == 'undefined'){
            return false;
        }
        this.data[name] = '';
        return true;
    },
    getGuest:function(name){
            return this.data[name];
    }
}

module.exports=draw_guess_data;
