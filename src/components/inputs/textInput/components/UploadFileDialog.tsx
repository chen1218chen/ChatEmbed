import { Form, Button, Modal, Tabs, Tab, InputGroup, Image } from 'solid-bootstrap';
import { createSignal } from 'solid-js';
// import { JSX } from 'solid-js/jsx-runtime';
import { uploadMessageFiles ,uploadCommonFiles} from '@/queries/sendMessageQuery';

type Props = {
  show: boolean;
  apiHost?: string;
  handleClose: () => void;
  onChange: (value: any) => void;
};
type FileInfo = { bucket: string; name: string; url: string };

export const UploadFileDialog = (props: Props) => {
  const [validated, setValidated] = createSignal(false);
  // const [imageData, setImageData] = createSignal('');
  const [imageData, setImageData] = createSignal<FileInfo | string>('');

  const [imagePreviewUrl, setImagePreviewUrl] = createSignal('');

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // const form = event.currentTarget;
    if (!validated()) {
      return;
    }
    props.onChange(imageData());

    if (imageData() !== '') {
      setValidated(true);
    }
    if (validated()) {
      props.handleClose();
    }
  };
  const emptyFile = { bucket: "", name: "", url: "" };
  const parseFileInfo = (fileStr: string) => {
    const matches = fileStr.match((/^(\S*)\/(\S*)\?(\S*)/));
    if(!matches || matches.length < 3) return emptyFile;

    return {
      bucket: matches[1] || "",
      name: matches[2] || "",
      url: fileStr || "",
    };
  }
 const handleSelect = async(e: any) => {
    const fileInput = document.querySelector('#fileUpload') as HTMLInputElement;
    const files = fileInput.files as FileList;
    if (e.target.files.length === 1) {
      // setImagePreviewUrl(URL.createObjectURL(file));
      //获取文件进行接口上传，返回图片地址
      const file = files[0];
      const formData = new FormData()
      formData.append('files', file, encodeURIComponent(file.name))
      const response = await uploadCommonFiles({
          apiHost: props.apiHost,
          formData:formData
      })
      console.log(response);
      
      if (response.data) {
          const fileInfo = parseFileInfo(response.data[0])
          setImageData(fileInfo)
          // setImageData(fileInfo as unknown as string)
      }
      setValidated(true);
    }
  };

  const handleClose = () => {
    setImageData('');
    setImagePreviewUrl('');
    setValidated(false);
    props.handleClose();
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">上传文件</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {imagePreviewUrl() && imagePreviewUrl().length > 0 && <Image src={imagePreviewUrl()} fluid style={{ margin: '10px auto' }} />}
          <Form noValidate validated={validated()} onSubmit={handleSubmit}>
              <Form.Group controlId="formFile" class="mb-3">
                <Form.Label>选择要上传的本地文件</Form.Label>
                <Form.Control type="file" required id="fileUpload" onChange={handleSelect} accept="image/*" />
                <Form.Control.Feedback type="invalid">请选择上传文件.</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" style={{ 'margin-right': '10px' }}>
                确定
              </Button>
              <Button onClick={handleClose}>取消</Button>
          </Form>

        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
};
