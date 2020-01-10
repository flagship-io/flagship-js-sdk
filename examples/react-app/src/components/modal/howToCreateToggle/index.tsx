import React, { useState } from 'react';
import { Button, Modal, Image } from 'react-bootstrap';

// TODO: modal fit UX
const HowToCreateToggleModal: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="light" onClick={handleShow}>
        More info here 😉
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create a use case on Flagship Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>1 - Sign in on Flagship</h5>
          <p>
            {' '}
            <a
              href="https://app.flagship.io/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to log in
            </a>
          </p>
          <h5 className="pt3">2 - Click on "+" button</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-30-28.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-30-28.png"
              fluid
            />
          </a>
          <h5 className="pt3">3 - Select or create a new project</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-33-43.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-33-43.png"
              fluid
            />
          </a>
          <h5 className="pt3">4 - Name your project (if creating a new one)</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-34-22.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-34-22.png"
              fluid
            />
          </a>
          <h5 className="pt3">5 - Choose a use case</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-36-11.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-36-11.png"
              fluid
            />
          </a>
          <h5 className="pt3">6 - Fill use case's basic info</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-38-13.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-38-13.png"
              fluid
            />
          </a>
          <h5 className="pt3">7 - Define use case's flag and scenarios</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-39-34.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-39-34.png"
              fluid
            />
          </a>
          <h5 className="pt3">8 - Define use case's targeting</h5>
          <a
            href="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-40-21.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{ cursor: 'zoom-in' }}
          >
            <Image
              src="https://storage.googleapis.com/flagship-dev-public-storage/Screenshot%20at%20Dec%2004%2016-40-21.png"
              fluid
            />
          </a>
          <h2 className="pt4 tc">All done 👏👏</h2>
          <Image
            className="db"
            style={{ marginRight: 'auto', marginLeft: 'auto' }}
            src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif"
            fluid
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <div className="mh3">Ok</div>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HowToCreateToggleModal;
