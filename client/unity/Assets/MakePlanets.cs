using UnityEngine;
using System.Collections;


public class MakePlanets : MonoBehaviour {

	public GameObject planet;

	// Use this for initialization
	void Start () {
		for (int i = 0; i < 5; i++) {
			Instantiate(planet, new Vector3(Random.Range (-10, 10), 0, 0), Quaternion.identity);
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
