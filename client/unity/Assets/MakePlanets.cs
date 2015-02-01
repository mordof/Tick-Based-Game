using UnityEngine;
using System.Collections;


public class MakePlanets : MonoBehaviour {
	public GameObject planet;

	static MakePlanets instance;

	// Use this for initialization
	void Start () {
		instance = this;

		Networking network = Networking.GetSingleton ();

		network.WriteTCP ("login", "{\"username\": \"mordof\"}");
		network.WriteTCP ("chat.public_message", "\"Test Chat Message\"");
		network.WriteTCP ("viewport.get_grid");

//		for (int i = 0; i < 5; i++) {
//			Instantiate(planet, new Vector3(Random.Range (-10, 10), 0, 0), Quaternion.identity);
//		}
	}

	void Callback(){

	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnApplicationQuit(){
		Networking.GetSingleton ().Close ();
	}

	public static void MakePlanet(float x, float y){
		Instantiate(instance.planet, new Vector3(x / 2, y / 2, 0), Quaternion.identity);
	}
}
