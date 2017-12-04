var users = {
    data:[],
    addUser:function(name){
        if(this.data.indexOf(name)>=0){
            return false;
        }else{
            this.data.push(name);
            return true;
        }
    },
    deleteUser:function(name){
        var index = this.data.indexOf(name);
        if(index>=0){
            this.data.splice(index,1);
            return true;
        }else{
            return false;
        }
    },
    hasUser:function(name){
            return this.data.indexOf(name)>-1?true:false;
    },
    getAllUser:function(){
        return this.data;
    }
}

module.exports=users;
