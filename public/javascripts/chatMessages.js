var chatMessenger={
  parent:null,
  base:null,
  Interval:null,
  messages:[],
  defWait:5000,
  initialize:function(elem){
    this.parent=elem;
    var bs=document.createElement("ul");
    bs.setAttribute("class","list-group swing");
    this.parent.append(bs);
    this.base=bs;
    // this.Interval=setInterval(()=>{
    //   this.onInterval();
    // },1000);
    return(this);
  },
  onInterval:function(){

  },
  addMessage:function(text,options={}){
    var txt=text;
    if("sender" in options){txt="<i>" + options.sender + ": </i>" + txt;}
    var el=document.createElement("li");
    el.setAttribute("class","list-group-item li_sm_padding");
    el.innerHTML=txt;
    if("background" in options){el.style.background=options.background;}
    this.base.append(el);
    setTimeout(()=>{
      el.classList.add("show");
    }, 10);
    setTimeout(()=>{
      el.classList.remove("show");
      setTimeout(()=>{
        this.removeMessage(el);
      },500);
    },this.defWait);
    return(el);
  },
  removeMessage:function(el){
    this.base.removeChild(el);
  }
}
