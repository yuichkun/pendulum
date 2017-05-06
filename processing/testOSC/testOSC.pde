import netP5.*;
import oscP5.*;

OscP5 osc;
NetAddress myRemoteLocation;
void setup(){
  osc = new OscP5(this,10000);
  myRemoteLocation = new NetAddress("127.0.0.1", 3333);

}

float offset = 0.0;

void draw(){
  float param;
  if(random(0,100) < 92){
    float noise = noise(offset);
    param = map(noise,0,1,0,1024);
    offset += 0.1;
  } else {
    //param = random(600,900);
    param = 1024;
  }
  println(param);
    OscMessage myMessage = new OscMessage("/pattern");
    myMessage.add(param); 
    osc.send(myMessage, myRemoteLocation); 
}