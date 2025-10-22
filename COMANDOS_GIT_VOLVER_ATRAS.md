COMANDOS GIT PARA VOLVER ATRÁS - MALAMALE PELUQUERÍA
=======================================================

📋 GUÍA COMPLETA DE COMANDOS GIT PARA REVERTIR CAMBIOS

🔍 1. VERIFICAR ESTADO ACTUAL
=============================

Comando: git status
Qué hace: Muestra el estado actual de tu repositorio
Cuándo usar: Siempre antes de hacer cualquier cambio
Ejemplo de resultado:
- Archivos modificados
- Archivos en staging
- Commits pendientes de subir

----------------------------------------------------

🔍 2. VER HISTORIAL DE COMMITS
==============================

Comando: git log --oneline -5
Qué hace: Muestra los últimos 5 commits de forma resumida
Cuándo usar: Para ver qué commits tienes y decidir a cuál volver
Ejemplo: 
24c802b (HEAD -> main) Últimos cambios
c19155f (origin/main) Cambios anteriores

----------------------------------------------------

🚫 3. DESCARTAR CAMBIOS NO GUARDADOS
====================================

Comando: git restore .
Qué hace: Elimina TODOS los cambios que no se han guardado (commit)
Cuándo usar: Cuando quieres descartar cambios en archivos modificados
⚠️ CUIDADO: Esto no se puede deshacer
Ejemplo: Si modificaste CSS y no te gusta, esto lo revierte

----------------------------------------------------

🚫 4. QUITAR ARCHIVOS DEL STAGING
=================================

Comando: git restore --staged .
Qué hace: Quita archivos del área de staging (antes del commit)
Cuándo usar: Cuando hiciste "git add" pero no quieres hacer commit
No elimina los cambios, solo los "desstaging"

----------------------------------------------------

🔄 5. VOLVER AL ÚLTIMO COMMIT (SUAVE)
====================================

Comando: git reset HEAD~1
Qué hace: Vuelve 1 commit atrás pero MANTIENE los cambios en archivos
Cuándo usar: Cuando quieres deshacer el commit pero conservar los cambios
Los archivos quedan modificados, puedes editarlos y hacer nuevo commit

----------------------------------------------------

💥 6. VOLVER AL ÚLTIMO COMMIT (FUERTE)
=====================================

Comando: git reset --hard HEAD~1
Qué hace: Vuelve 1 commit atrás y ELIMINA todos los cambios
Cuándo usar: Cuando quieres eliminar completamente el último commit
⚠️ CUIDADO: Esto no se puede deshacer, se pierden todos los cambios

----------------------------------------------------

💥 7. VOLVER VARIOS COMMITS ATRÁS
=================================

Comando: git reset --hard HEAD~3
Qué hace: Vuelve 3 commits atrás y elimina todos los cambios
Cuándo usar: Cuando quieres volver muy atrás en el tiempo
⚠️ CUIDADO: Pierdes todo lo que hiciste en esos 3 commits

----------------------------------------------------

🔄 8. VOLVER A UN COMMIT ESPECÍFICO
===================================

Comando: git reset --hard c19155f
Qué hace: Vuelve exactamente al commit con ese ID
Cuándo usar: Cuando sabes exactamente a qué punto quieres volver
Primero usa "git log --oneline" para ver los IDs

----------------------------------------------------

🌐 9. SINCRONIZAR CON GITHUB
============================

Comando: git pull origin main
Qué hace: Descarga los últimos cambios de GitHub
Cuándo usar: Para asegurarte de tener la versión más reciente

Comando: git push origin main
Qué hace: Sube tus commits locales a GitHub
Cuándo usar: Después de hacer commits que quieres guardar

----------------------------------------------------

🆘 10. COMANDOS DE EMERGENCIA
=============================

SITUACIÓN: "Metí la pata y quiero volver a como estaba en GitHub"
SOLUCIÓN:
1. git restore --staged .
2. git restore .
3. git reset --hard origin/main

SITUACIÓN: "No sé qué hice, ayuda!"
SOLUCIÓN:
1. git status (para ver qué pasó)
2. git log --oneline -5 (para ver commits)
3. git restore . (si solo quieres descartar cambios)

----------------------------------------------------

📝 11. FLUJO RECOMENDADO ANTES DE CAMBIOS
=========================================

1. git status (verificar estado)
2. git pull origin main (actualizar desde GitHub)
3. Hacer tus cambios
4. git add . (si quieres guardar)
5. git commit -m "Descripción del cambio"
6. git push origin main (subir a GitHub)

----------------------------------------------------

⚠️ IMPORTANTE - QUÉ SIGNIFICA CADA COSA:
==========================================

- working directory: Archivos que estás editando
- staging area: Archivos preparados para commit (después de git add)
- committed: Archivos guardados en el historial (después de git commit)
- HEAD: El commit actual donde estás
- origin/main: La versión que está en GitHub

----------------------------------------------------

🎯 CONSEJOS PRÁCTICOS:
======================

1. Siempre haz "git status" antes de cualquier comando
2. Si no estás seguro, haz una copia de tu carpeta antes
3. Los comandos con --hard NO se pueden deshacer
4. Usa "git log --oneline" para ver tu historial
5. Si algo sale mal, pide ayuda antes de seguir

----------------------------------------------------

📞 CONTACTO DE SOPORTE:
=======================
Si tienes problemas con Git, siempre puedes:
- Hacer una copia de seguridad de tu carpeta
- Pedir ayuda específica con el error que ves
- Usar "git status" para explicar qué está pasando

FECHA DE CREACIÓN: 21 de Octubre 2025
PROYECTO: MalaMale Peluquería Unisex
AUTOR: Asistente IA

=======================================================