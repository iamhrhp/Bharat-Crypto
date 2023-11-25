import {AnimationObject} from 'lottie-react-native';

export interface AnimationFilesProps {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backGroundColor: string;
}

const AnimationFiles: AnimationFilesProps[] = [
  {
    id: 1,
    animation: require('../assets/Animation/Lottie1.json'),
    text: 'lorem5 ipsum',
    textColor: '#005b4f',
    backGroundColor: '#ffa3ce',
  },
  {
    id: 2,
    animation: require('../assets/Animation/Lottie2.json'),
    text: 'lorem5 ipsum',
    textColor: '#1e2169',
    backGroundColor: '#bae4fd',
  },
  {
    id: 3,
    animation: require('../assets/Animation/Lottie3.json'),
    text: 'lorem5 ipsum',
    textColor: '#f15937',
    backGroundColor: '#faeb8a',
  },
];

export default AnimationFiles;
