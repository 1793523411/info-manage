export const tmpEditorBody = {
  topicTitle: '1232131',
  topicTag: ['1', '2'],
  topicText: 'esdsdsa',
  topicImgList: [
    {
      // uid: '-4',
      // name: 'image.png',
      // status: 'done',
      url: 'https://info-share.oss-cn-beijing.aliyuncs.com/topImg/ygj111-4928730523314232733-20220211-154528.jpeg',
    },
    {
      url: 'https://info-share.oss-cn-beijing.aliyuncs.com/topImg/ygj111-796402879280463422-avataaars (1).png',
    },
  ],
};

export const customEditorBody = {
  topicTitle: 'eeffsdda',
  topicTag: ['???', '!!!'],
  textValue:
    '<p>11111 eewcw</p><p><br></p><p>dwdwecewce</p><p><br></p><p><img src="https://info-share.oss-cn-beijing.aliyuncs.com/topImg/ygj111-4042451259310150420-avataaars (2).png">wqw</p><p>wqdqwdqwdqw</p><p>dwqdwqdqw</p><p><br></p>',
};

export const tmpEditor = {
  type: 'template',
  body: JSON.stringify(tmpEditorBody),
};
export const customEditor = {
  type: 'custom',
  body: JSON.stringify(customEditorBody),
};
