import { Form, Button, Modal, Tabs, Tab, InputGroup, Image } from 'solid-bootstrap';
import { createSignal } from 'solid-js';
// import { JSX } from 'solid-js/jsx-runtime';

type Props = {
  show: boolean;
  handleClose: () => void;
  onChange: (value: any) => void;
};
export const UploadDialog = (props: Props) => {
  const [validated, setValidated] = createSignal(false);
  const [imageData, setImageData] = createSignal('');
  const [key, setKey] = createSignal('home');
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // const form = event.currentTarget;
    if (!validated()) {
      return;
    }
    // console.dir(form);
    if (key() === 'home') {
      const fileInput = document.querySelector('#fileUpload') as HTMLInputElement;
      const files = fileInput.files;
      if (files && files.length === 1) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (!evt?.target?.result) {
            return;
          }
          const { result } = evt.target;
          props.onChange(result);
          setImageData(result.toString());
        };
        reader.readAsDataURL(file);
        // uploadFile(file);
      }
    } else {
      props.onChange(imageData());
    }
    if (imageData() !== '') {
      setValidated(true);
    }
    if (validated()) {
      props.handleClose();
    }
  };

  const changeTab = (k: string | any) => {
    setKey(k);
    setImageData('');
    setValidated(false);
    // const url = document.getElementById('basic-url') as HTMLFormElement;
    // url.value = '';
  };
  const handleSelect = (e: any) => {
    if (e.target.files.length === 1) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
        props.onChange(result);
        setImageData(result.toString());
      };
      reader.readAsDataURL(file);
      setValidated(true);
    }
  };

  // 验证url是否正确
  const isURL = (url: string) => {
    const strRegex =
      '^((https|http|ftp)://)?' + //(https或http或ftp):// 可有可无
      "(([\\w_!~*'()\\.&=+$%-]+: )?[\\w_!~*'()\\.&=+$%-]+@)?" + //ftp的user@ 可有可无
      '(([0-9]{1,3}\\.){3}[0-9]{1,3}' + // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
      '|' + // 允许IP和DOMAIN（域名）
      '(localhost)|' + //匹配localhost
      "([\\w_!~*'()-]+\\.)*" + // 域名- 至少一个[英文或数字_!~*\'()-]加上.
      '\\w+\\.' + // 一级域名 -英文或数字 加上.
      '[a-zA-Z]{1,6})' + // 顶级域名- 1-6位英文
      '(:[0-9]{1,5})?' + // 端口- :80 ,1-5位数字
      '((/?)|' + // url无参数结尾 - 斜杆或这没有
      "(/[\\w_!~*'()\\.;?:@&=+$,%#-]+)+/?)$"; //请求参数结尾- 英文或数字和[]内的各种字符
    const re = new RegExp(strRegex, 'i'); // 大小写不敏感
    if (re.test(encodeURI(url))) {
      return true;
    }
    return false;
  };
  const handleUrlChange = (e: any) => {
    const value = e.currentTarget.value;
    setImageData(value);
    // props.onChange(value);
    setValidated(isURL(value.trim()));
    // console.log(isURL(imageData().trim()))
  };
  const handleClose = () => {
    setImageData('');
    setValidated(false);
    props.handleClose();
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">上传图片</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {imageData() && imageData().length > 0 && <Image src={imageData()} fluid style={{ margin: '10px auto' }} />}
          <Tabs id="controlled-tab-example" activeKey={key()} onSelect={changeTab} class="mb-3">
            <Tab eventKey="home" title="本地图片">
              <Form noValidate validated={validated()} onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" class="mb-3">
                  <Form.Label>选择要上传的本地图片</Form.Label>
                  <Form.Control type="file" required id="fileUpload" onChange={handleSelect} accept="image/*" />
                  <Form.Control.Feedback type="invalid">请选择上传图片.</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" style={{ 'margin-right': '10px' }}>
                  确定
                </Button>
                <Button onClick={handleClose}>取消</Button>
              </Form>
            </Tab>
            <Tab eventKey="online" title="在线图片">
              <Form noValidate validated={validated()} onSubmit={handleSubmit}>
                <Form.Label for="basic-url">在线图片</Form.Label>
                <InputGroup class="mb-3">
                  {/* <InputGroup.Text id="basic-addon3">https://example.com/users/</InputGroup.Text> */}
                  <Form.Control id="basic-url" value={imageData()} aria-describedby="basic-addon3" onChange={handleUrlChange} />
                  <Form.Control.Feedback type="invalid">请出入在线图片地址，http://XXX/https://XXX</Form.Control.Feedback>
                </InputGroup>

                <Button type="submit" style={{ 'margin-right': '10px' }}>
                  确定
                </Button>
                <Button onClick={handleClose}>取消</Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
};
