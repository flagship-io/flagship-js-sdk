/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/accessible-emoji */
import flagship, { IFlagshipVisitor, EventHit } from '@flagship.io/js-sdk';
import CodeBlock from '@tenon-io/tenon-codeblock';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import './App.css';
import Header from './components/header';
import HowToCreateToggleModal from './components/modal/howToCreateToggle';

const App: React.FC = () => {
  const [fsVisitor, setFsVisitor] = useState<IFlagshipVisitor | null>(null);
  const [customBtnData, setCustomBtnData] = useState<{ [key: string]: string }>(
    {}
  );
  useEffect(() => {
    const fsSdk = flagship.initSdk('bn1ab7m56qolupi5sa0g', {
      fetchNow: true,
      enableConsoleLogs: true,
    });
    const visitorInstance: IFlagshipVisitor = fsSdk.newVisitor('test-perf', {
      screenMode: 'light',
    });
    visitorInstance.on('ready', () => {
      setFsVisitor(visitorInstance);
    });
  }, []);
  useEffect(() => {
    if (fsVisitor) {
      fsVisitor
        .getModifications(
          [
            {
              key: 'color',
              defaultValue: '#fff',
            },
            {
              key: 'borderColor',
              defaultValue: '#007bff',
            },
            {
              key: 'backgroundColor',
              defaultValue: '#007bff',
            },
          ],
          true
        )
        .then((data) => setCustomBtnData(data as { [key: string]: string }));
    }
  }, [fsVisitor]);
  return (
    <>
      <Header />
      <Container className="mt3">
        <Row>
          <Col>
            <a className="fsAnchor" id="initialization" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Initialization 🔌🕹</Alert.Heading>
              <p>
                In your React component, create first a state hook for your
                visitor:
              </p>
              <CodeBlock
                className="mv3"
                codeString="const [fsVisitor, setFsVisitor] = useState(null);"
              />
              <p>Then initialize everything, using an effect hook:</p>
              <CodeBlock
                className="mv3"
                codeString={`useEffect(() => {
  const fsSdk = flagship.initSdk('bn1ab7m56qolupi5sa0g', { fetchNow: true, enableConsoleLogs: true });

  const visitorInstance = fsSdk.newVisitor('test-perf', {
    screenMode: 'light',
  });

  visitorInstance.on('ready', () => {
    setFsVisitor(visitorInstance);
  });
}, []);`}
              />
              <Alert variant="info" className="fs-alert">
                <b>NOTE:</b> You can check logs generated using your browser
                inspect tools :)
              </Alert>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <a className="fsAnchor" id="modifications" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Get customized modifications 🎬</Alert.Heading>
              <Alert variant="info" className="fs-alert">
                <Alert.Heading>Prerequisite:</Alert.Heading>
                <p>
                  Make sure to create a use case on Flagship Dashboard first
                </p>
                <HowToCreateToggleModal />
              </Alert>
              <p>
                Considering you want to customize a "add to basket" button which
                actually in your code looks similar to this:
              </p>
              <CodeBlock
                className="mv3"
                codeString={
                  '<Button variant="primary" className="mb3">Add to basket  🛒</Button>'
                }
              />
              <p>
                <b>Output:</b>
              </p>
              <Button variant="primary" className="mb3">
                Add to basket 🛒
              </Button>
              <p>
                Black friday event is coming, so you're looking to access
                modifications in order to put specific style to this button
                using Flagship.
                <br />
                Here an example of how to get customized modifications and apply
                it to the button
              </p>
              <p>1 - Add state hook</p>
              <CodeBlock
                className="mv3"
                codeString={
                  'const [customBtnData, setCustomBtnData] = useState<{[key: string]: string}>({});'
                }
              />
              <p>2 - Initialized it with getModifications function</p>
              <CodeBlock
                className="mv3"
                codeString={`useEffect(
  () => {
    if (fsVisitor) {
      fsVisitor.getModifications([
        {
          key: 'color',
          defaultValue: '#fff',
        },
        {
          key: 'borderColor',
          defaultValue: '#007bff',
        },
        {
          key: 'backgroundColor',
          defaultValue: '#007bff',
        },
      ], true).then((data) => setCustomBtnData(data as {[key: string]: string}));
    }
  }, [fsVisitor],
);`}
              />
              <p>3 - Plug it</p>
              <CodeBlock
                className="mv3"
                codeString={`<Button
  variant="primary"
  className="mb3"
  style={
    {
      color: customBtnData.color,
      backgroundColor: customBtnData.backgroundColor,
      borderColor: customBtnData.borderColor,
    }
  }
>
  Add to basket  🛒
</Button>`}
              />
              <p>
                <b>Output:</b>
              </p>
              <Button
                variant="primary"
                className="mb3"
                style={{
                  color: customBtnData.color,
                  backgroundColor: customBtnData.backgroundColor,
                  borderColor: customBtnData.borderColor,
                }}
              >
                Add to basket 🛒
              </Button>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <a className="fsAnchor" id="hits" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Send some tracking info 📬</Alert.Heading>
              <p>
                Continuing the previous example (Customized black friday add to
                basket button), let's add a hit when the user click on the
                button.
                <br />
                The hit will be type of <b>event</b>
              </p>
              <CodeBlock
                className="mv3"
                codeString={`<Button
  {...}
  onClick={(): void => {
    if (fsVisitor) {
      const eventPayload: EventHit = {
        category: 'Action Tracking',
        action: 'clickOnBasketButton',
      };
      fsVisitor.sendHits([
        {
          type: 'Event',
          data: eventPayload,
        },
      ]);
    }
  }}
  style={...}
>
  Add to basket  🛒
</Button>`}
              />
              <p>
                <b>Output:</b>
              </p>
              <Button
                variant="primary"
                className="mb3"
                onClick={(): void => {
                  if (fsVisitor) {
                    const eventPayload: EventHit = {
                      category: 'Action Tracking',
                      action: 'clickOnBasketButton',
                    };
                    fsVisitor.sendHits([
                      {
                        type: 'Event',
                        data: eventPayload,
                      },
                    ]);
                  }
                }}
                style={{
                  color: customBtnData.color,
                  backgroundColor: customBtnData.backgroundColor,
                  borderColor: customBtnData.borderColor,
                }}
              >
                Add to basket 🛒
              </Button>
              <Alert variant="info" className="fs-alert">
                <b>NOTE:</b> You can check API call using your browser inspect
                tools (network section) :)
              </Alert>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <a className="fsAnchor" id="unit-tests" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Unit tests 📋✅</Alert.Heading>
              You might have to mock the Flagship SDK in your tests.
              <br />
              Considering you're using jest:
              <CodeBlock
                className="mv3"
                codeString={`
import flagship from '@flagship.io/js-sdk';
import { EventEmitter } from 'events';

flagship.initSdk = jest.fn().mockImplementation(() => ({
  newVisitor: () => {
    const self = new EventEmitter();
    return self;
  },
}));
                  `}
              />
              <Alert variant="info" className="fs-alert">
                <b>NOTE:</b> This sample can be adjust according your needs.
              </Alert>
              <Alert variant="info" className="fs-alert">
                <b>NOTE2:</b> Have a look to <b>App.test.tsx</b> for a complete
                overview.
              </Alert>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <a className="fsAnchor" id="other" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Some additional info ‍📑</Alert.Heading>
              <p>
                Once the SDK is initialized and a fetched of modifications has
                been done (fetchNow=true, getModifications() called), you can
                have access to the fetched data like so:
              </p>
              <CodeBlock
                className="mv3"
                codeString={`
  const fsModificationsInCache = fsVisitor.fetchedModifications;
  console.log(fsModificationsInCache);
                  `}
              />
              <p>Which gives something like: </p>
              {fsVisitor !== null && (
                <CodeBlock
                  className="mv3"
                  codeString={
                    fsVisitor !== null &&
                    JSON.stringify(fsVisitor.fetchedModifications, null, 1)
                  }
                />
              )}
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
