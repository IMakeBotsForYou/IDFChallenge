let load = 0;
let force = 100000;
let req_s = 140;
let base_m = 35000;

//  This is to update the calculations every time a key
//  is pressed. But, yall wanted a system that doesn't
//  do useless computations, so I made it a forum.
//  Thus, this file is no longer needed, but I'll keep 
//  it here for perservation's sake.
function update_calc(){
  load = document.getElementById("load").value;
  force = document.getElementById("force").value;
  req_s = document.getElementById("req_speed").value;
  base_m = document.getElementById("base_mass").value;

  //  default values
  load = load == "" ? 0 : parseInt(load);
  force = force == "" ? 100000 : parseInt(force);
  req_s = req_s == "" ? 140 : parseInt(req_s);
  base_m = base_m == "" ? 35000 : parseInt(base_m)

  let result_dist = document.getElementById("distance");
  let result_time = document.getElementById("time");
  let warning = document.getElementById("warning");
  if (load < 0 || force <= 0 || req_s <= 0 || base_m <= 0 || load > 99999999999999999999 || force > 99999999999999999999 || req_s > 99999999999999999999 || base_m > 99999999999999999999){
    result_dist.innerHTML = "N/A";
    result_time.innerHTML = "N/A";
    warning.innerHTML = "Warning: Invalid input";

  } else {
    result_dist.innerHTML = distance_till_takeoff(parseInt(load)).toFixed(2) + "m";
    result_time.innerHTML = time_till_takeoff(parseInt(load)).toFixed(2) + " seconds";
    warning.innerHTML = "Warning: None"; 

  }

} 

function time_till_takeoff(mass){
  let fullMass = base_m + mass;
  let time = (fullMass * req_s) / force;
  if (time > 60){
    max = 60 * force / req_s - base_m;
    warning.innerHTML = `Plane unencumbered. Please remove ${(mass - max).toFixed(2)}kg from the plane. `;
  }
  return time;
}

function distance_till_takeoff(mass){
  let fullMass = base_m + mass;
  let a = force / fullMass;
  let t = time_till_takeoff(mass);
  return 0.5 * (a * t * t);
}  