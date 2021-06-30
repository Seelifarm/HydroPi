PYTHON ?= python

all:
	$(PYTHON) setupSpidev.py build

install:
	$(PYTHON) setupSpidev.py install

clean:
	$(PYTHON) setupSpidev.py clean
	rm -rf build dist

cleandir distclean: clean
	$(PYTHON) setupSpidev.py clean -a

