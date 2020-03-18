import socket
import threading
import sys
import pickle
import random
import math





class Cliente():
	"""docstring for Cliente"""
	def __init__(self, host="localhost", port=4000):
		
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.connect((str(host), int(port)))

		msg_recv = threading.Thread(target=self.msg_recv)
		msg_recv.daemon = True
		msg_recv.start()

		while True:
			word = input('->')
			msg= encriptar(word)
			if msg != 'salir':
				self.send_msg(msg)
			else:
				self.sock.close()
				sys.exit()

	def msg_recv(self):
		while True:
			try:
				data = self.sock.recv(1024)
				if data:
					print('Encriptado')
					print(pickle.loads(data))
					print('Desencriptado: ')
					prueba = pickle.loads(data)
					desEncriptar(prueba)
			except:
				pass

	def send_msg(self, msg):
		self.sock.send(pickle.dumps(msg))


c = Cliente()
		