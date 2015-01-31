using UnityEngine;
using System.Threading;
using System.Collections;
using System.Net.Sockets;
using System.IO;

public class Networking : MonoBehaviour {

	public TcpClient client;
	private bool clientClosed;

	// Use this for initialization
	void Start () {
		clientClosed = false;
		Thread t = new Thread (new ThreadStart (Comm));
		t.Start ();
	}

	void OnApplicationQuit () {
		if (clientClosed == false) {
			CloseClient ();
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void Comm(){
		client = new TcpClient ("192.168.234.130", 3060);
		
		try {
			Stream s = client.GetStream();
			StreamReader sr = new StreamReader(s);
			StreamWriter sw = new StreamWriter(s);
			sw.AutoFlush = true;

			sw.Write ("login|:{\"username\": \"mordof\"}:|");
			sw.Write ("chat.public_message|:\"Test Chat Message\":|");
			sw.Write ("viewport.get_grid:|");

			var msg = sr.ReadLine ();

			while(msg != null){
				Debug.Log ("Message: " + msg);
				msg = sr.ReadLine ();
			}


		} finally {
			CloseClient ();
			clientClosed = true;
		}
	}

	void CloseClient() {
		client.Client.Disconnect (false);
		client.GetStream ().Close ();
		client.Close ();
		Debug.Log ("Client Connection Closed");
	}
}
