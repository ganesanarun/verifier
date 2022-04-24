.ONESHELL: # Applies to every targets in the file!

NPM=$(shell which npm 2> /dev/null)
YARN=$(shell which yarn 2> /dev/null)

ui: 
	cd ./client  && YARN install && YARN start

.PHONY: ui

server:
	cd ./server && NPM install && npm start

.PHONY: server