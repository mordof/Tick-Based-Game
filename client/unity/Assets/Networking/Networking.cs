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
	private DispatchHandler dispatcher;

	private static volatile Networking instance;
	private static object lockObj = new System.Object ();

	private Socket _socket;

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

	private void Init (){
		dispatcher = DispatchHandler.GetSingleton ();

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
			Debug.Log (Encoding.ASCII.GetString (buffer));
		}

		buffer = new byte[1024];
		_socket.BeginReceive (buffer, 0, buffer.Length, SocketFlags.None, ReceiveCallback, buffer);
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

	public void DispatchCommand(string command, string contents){
		dispatcher.recieveCommand (command, contents);
	}
	
	private void CloseClient() {
		_socket.Close ();
		clientClosed = true;
		Debug.Log ("Client Connection Closed");
	}
}
