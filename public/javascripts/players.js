var player_data={
  li:{},
  addPlayer:function(id,name,type,color){
    this.li[id]={
      name:name,
      type:type,
      color:color
    };
    return(id);
  },
  removePlayer:function(id=null){
    if(id==null){
      this.li={};
    }
    else{
      delete this.li[id];
    }
  },
  getPlayers:function(){
    return(this.li);
  }
}
