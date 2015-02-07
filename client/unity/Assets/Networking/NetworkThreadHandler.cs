using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class NetworkThreadHandler : MonoBehaviour {
	private LinkedList<KeyValuePair<string,string>> task_queue = new LinkedList<KeyValuePair<string,string>>();
	private DispatchHandler dispatch_handler;

    private Networking network;

    void Awake() {
        network = Networking.GetSingleton ();

        network.SetStackCallback (ThreadStackModifier);
    }

	// Use this for initialization
	void Start () {
		dispatch_handler = DispatchHandler.GetSingleton ();

        network.WriteTCP ("login", "{\"username\": \"mordof_home\"}");
		network.WriteTCP ("chat.public_message", "\"Test Chat Message\"");
		network.WriteTCP ("viewport.get_grid");
	}

	void ThreadStackModifier(string command, string data){
		lock (task_queue) {
			task_queue.AddLast (new KeyValuePair<string, string>(command, data));
		}
	}
	
	// Update is called once per frame
	void Update () {
		lock (task_queue) {
			if (task_queue.Count > 0) {
				// There are tasks to be done
				KeyValuePair<string, string> task = task_queue.First.Value;
				task_queue.RemoveFirst ();
				if(task.Value == ""){
					dispatch_handler.recieveCommand (task.Key);
				} else {
					dispatch_handler.recieveCommand (task.Key, task.Value);
				}
			}
		}
	}

	void OnApplicationQuit(){
		Networking.GetSingleton ().Close ();
	}
}
