# Evaluación Técnica Frontend

## Página 1

Evaluación PE Front End 2026

Vamos a utilizar la pagina http://¡wtbuilder.¡amiekurtz.com para crear 2 JWT, en el apartado
de Role, el primero tendrá el valor de “Supervisor”, el segundo tendrá el valor de
“Operador”, esto con el objetivo de tener diferentes vistas en base al usuario que inicie
sesión.

Roles:

- Supervisor : Cancelaciones y Devoluciones
- Operador : Ventas y Consultas

Se desarrollara un Front el cual tenga las siguientes características:

- — Login : En base al usuario y password, nos regresara el server un jwt para saber que
vista mostrar en base al role

- Main : Se visualizará en base al role las transacciones permitidas

- Vista Operador : Input para las transacciones, Venta, importe, nombre de la persona,
número de tarjeta, fecha de expiración y cvv.

- Vista Supervisor : Input para las transacciones, Cancelaciones y Devoluciones,
número de referencia financiera, número de tarjeta.

Para la parte del BackEnd podemos ocupar la herramienta https://mockoon.com para
simular respuestas

Datos de respuesta del servidor simulado:

- Venta : Número de aprobación (6 dígitos), número de referencia financiera (8
dígitos), tarjeta enmascaradas, (ejemplo 1234*****1234)

- Consultas : Regresar mínimo 10 registros de transacciones aprobadas

- Cancelaciones y Devoluciones : Número de aprobación (6 dígitos), número de
referencia financiera (8 dígitos), tarjeta enmascaradas, (ejemplo 1234*****1234) y
estatus aplicado

El diseño del a interfaz queda libre al desarrollador, tendrá un peso importante en la
evaluación el UIX que implemente

Status Http
- 200: En cada petición se debe mostrar una notificación para visualizar este status
- 400: En caso de algún error , se debe manejar una notificación diferente a la del

status 200

Se debe de ocupar para la Venta el método Post, para la Cancelación y Devolución el
método Patch o Update, para la consulta de transacciones el método Get.


---

## Página 2

Para la Venta, se debe de enviar el número de tarjeta, la fecha de expiración y el cvv cifrado
mediante el algoritmo AES para proteger la información.

La información entre el Front y el Backend será en formato JSON.
