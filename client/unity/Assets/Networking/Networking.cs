using UnityEngine;
using System.Threading;
using System.Collections;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System;
using System.Text;

public class Networking {
	private bool clientClosed;

	private static volatile Networking instance;
	private static object lockObj = new System.Object ();

	private Socket _socket;

	private String tcpMessages = "";
	private Action<string,string> stack_modifier_callback;

	public Networking () {}

	public static Networking GetSingleton(){
		if (instance == null) {
			lock (lockObj){
				if(instance == null){
					instance = new Networking ();
					instance.Init ();
				}
			}
		}

		return instance;
	}

	public void SetStackCallback(Action<string,string> callback){
		stack_modifier_callback = callback;
	}

	private void Init (){
		IPAddress ipa = new IPAddress (new byte[]{192, 168, 234, 130});
		IPEndPoint endpoint = new IPEndPoint (ipa, 3060);

		_socket = new Socket(endpoint.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
		_socket.Connect (endpoint);

		byte[] buffer = new byte[1024];
		_socket.BeginReceive (buffer, 0, buffer.Length, SocketFlags.None, ReceiveCallback, buffer);

		clientClosed = false;
	}

	private void ReceiveCallback(IAsyncResult result){
		byte[] buffer = (byte[])result.AsyncState;
		int count = _socket.EndReceive (result);

		if (count > 0) {
			//Debug.Log (Encoding.ASCII.GetString (buffer));
			tcpMessages += Encoding.ASCII.GetString (buffer);
			ParseBuffer ();
		}

		buffer = new byte[1024];
		_socket.BeginReceive (buffer, 0, buffer.Length, SocketFlags.None, ReceiveCallback, buffer);
	}

	private void ParseBuffer(){
		bool is_end_of_command = (tcpMessages.Substring (tcpMessages.Length - 2) == ":|") ? true : false;

		string[] messages = tcpMessages.Split (new string[]{":|"}, StringSplitOptions.None);

		if (messages.Length == 1 && is_end_of_command == false) {
			return;
		}

		for (var i = 0; i < messages.Length - 1; i++) {
			ProcessCommand(messages[i]);
		}

		string last_section = messages[messages.Length - 1];

		if (is_end_of_command == true) {
			ProcessCommand (last_section);
			tcpMessages = "";
		} else {
			tcpMessages = last_section;
		}
	}

	private void ProcessCommand(string message){
		string[] details = message.Split (new string[]{ "|:" }, StringSplitOptions.None);

		if (details.Length > 1) {
			DispatchCommand (details [0], details [1]);
		} else {
			DispatchCommand (details [0]);
		}
	}
	
	public void Close () {
		if (clientClosed == false) {
			CloseClient ();
		}
	}

	static byte[] GetBytes(string str)
	{
		return Encoding.ASCII.GetBytes (str);
	}

	public void WriteTCP(string command){
		_socket.Send (GetBytes (string.Format ("{0}:|", command)));
	}

	public void WriteTCP(string command, string contents){
		_socket.Send (GetBytes (string.Format ("{0}|:{1}:|", command, contents)));
	}

	public void DispatchCommand(string command, string data){
		stack_modifier_callback (command, data);
	}

	public void DispatchCommand(string command){
		stack_modifier_callback (command, "");
	}
	
	private void CloseClient() {
		_socket.Close ();
		clientClosed = true;
		Debug.Log ("Client Connection Closed");
	}
}
