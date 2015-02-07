using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Chat : MonoBehaviour {
    private Networking network;
	public GameObject chat_text;

	static Chat instance;

	// Use this for initialization
	void Start () {
		instance = this;
        network = Networking.GetSingleton ();
	}

	public static void DisplayText(string text){
        Text text_message = instance.chat_text.GetComponent<Text> ();
		text_message.text += string.Format("{0}\n", text);
	}

    public void GetInput(string text){
        network.WriteTCP ("chat.public_message", string.Format ("\"{0}\"", text));
        GetComponent<InputField> ().text = "";
    }
}
