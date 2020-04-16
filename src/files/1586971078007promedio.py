alumnos={'Hugo':(10,9,8), 'Paco':(7,4), 'Luis':(7,9), 'Maria': (9,4,6,10)}

for k,v in alumnos.items():
   operations = 0 
   for i in v:
     operations += i
   v = operations / len(v)
   print(k,v)
  
    

    
   