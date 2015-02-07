using UnityEngine;
using System.Collections;
using System;


public class MakePlanets : MonoBehaviour {
	public GameObject planet;

	static MakePlanets instance;

	// Use this for initialization
	void Start () {
		instance = this;





//		for (int i = 0; i < 5; i++) {
//			Instantiate(planet, new Vector3(Random.Range (-10, 10), 0, 0), Quaternion.identity);
//		}
	}

	void Callback(){

	}
	
	// Update is called once per frame
	void Update () {
	
	}



	public static void MakePlanet(float x, float y){
		Instantiate(instance.planet, new Vector3(x / 2, y / 2, 0), Quaternion.identity);
	}
}
