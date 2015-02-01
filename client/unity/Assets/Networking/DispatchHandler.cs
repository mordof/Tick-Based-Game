using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;

public class DispatchHandler {
	private static volatile DispatchHandler instance;
	private static object lockObj = new Object ();
	
	public DispatchHandler () {}
	
	public static DispatchHandler GetSingleton(){
		if (instance == null) {
			lock (lockObj){
				if(instance == null){
					instance = new DispatchHandler ();
					instance.Init ();
				}
			}
		}
		
		return instance;
	}

	private void Init(){}

	public void recieveCommand(string command, string data){
		if (command == "viewport.get_grid") {
			Debug.Log (data);
			List<RootObject> grid_stuff = JsonConvert.DeserializeObject<List<RootObject>>(data);

			foreach(RootObject item in grid_stuff){
				MakePlanets.MakePlanet (item.obj.location[0], item.obj.location[1]);
			}
		}
	}

	public void recieveCommand(string command){

	}
}

public class Offset
{
	public int x { get; set; }
	public int y { get; set; }
}

public class Obj
{
	public string _id { get; set; }
	public string color { get; set; }
	public int count { get; set; }
	public List<float> location { get; set; }
	public Offset offset { get; set; }
	public string name { get; set; }
}

public class RootObject
{
	public Obj obj { get; set; }
	public string type { get; set; }
}