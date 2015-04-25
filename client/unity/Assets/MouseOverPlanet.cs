using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;

public class MouseOverPlanet : MonoBehaviour {
    public GameObject scoreText;
    public GameObject planetDetails;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnMouseEnter(){
        var planetX = GetComponent<Transform> ().localPosition.x * 2;
        var planetY = GetComponent<Transform> ().localPosition.y * 2;

        Vector3 detailsPosition = Camera.main.WorldToScreenPoint (new Vector3 (planetX / 2, planetY / 2, 0));

        planetDetails.GetComponent<RectTransform> ().position = new Vector3 (detailsPosition.x - 90, detailsPosition.y + 40, 0);
        planetDetails.GetComponentInChildren<Text> ().text = String.Format ("X Location: {0}\nY Location: {1}", planetX, planetY);

        var score = int.Parse (scoreText.GetComponent<Text> ().text);
        
        score += 1;
        
        scoreText.GetComponent<Text> ().text = score.ToString ();
    }

    void OnMouseExit(){
        planetDetails.GetComponent<RectTransform> ().position = new Vector3(-140, 0, 0);
    }
}
