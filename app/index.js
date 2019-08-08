import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { me as appbit } from "appbit";
import clock from "clock";
import { battery, charger } from "power";
import { preferences } from "user-settings";
import document from "document";
import * as util from "../common/utils";

const hrLabel = document.getElementById("heart");
const heartIcon = document.getElementById("heartimg");
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    hrLabel.text = `${hrm.heartRate ? hrm.heartRate : 0}`
  });
  hrm.start();
} else {
  hrLabel.style.display = "none";
  heartIcon.style.display = "none";
}

clock.granularity = "seconds";
const onTick = (event) => {
  const clockLabel = document.getElementById("clock");
  const time = event.date;
  let hours = time.getHours();
  if (preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12;
  } else {
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(time.getMinutes());
  clockLabel.text = `${hours}:${mins}`;

  const dateLabel = document.getElementById("date");
  const month = time.getMonth();
  const months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  dateLabel.text = `${months[month]} ${time.getDate()}`;
  
  const stepsLabel = document.getElementById("steps");
  if (appbit.permissions.granted("access_activity")) {
    const steps = today.adjusted.steps;
    stepsLabel.text = `${steps ? steps : 0}`
  }
  
  const batteryLabel = document.getElementById("battery");
  const batteryOffsetLabel = document.getElementById("battery-offset");
  batteryLabel.text = `${Math.floor(battery.chargeLevel)}%`
  batteryOffsetLabel.text = `${Math.floor(battery.chargeLevel)}%`
  if (Math.floor(battery.chargeLevel) <= 16 || charger.connected) {
    batteryLabel.style.display = "none";
    batteryOffsetLabel.style.display = "inherit";
  } else {
    batteryLabel.style.display = "inherit";
    batteryOffsetLabel.style.display = "none";
  }
};
clock.ontick = onTick;
