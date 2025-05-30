import { Avatar, Chip } from '@mui/material';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export const AvatarChip = ({id=null, name=null, src=null, link=true}) => {
  if(!id || !name){
    return null
  }

  if(link){
    if(src){
      return (
        <a href={`/reviews/usuarios/${id}`} target='_blank'>
          <Chip
            avatar={<Avatar {...stringAvatar(name)} alt={name} src={src} />}
            label={name}
            variant="outlined"
          />
        </a>
      )
    }
  
    return (
      <a href={`/reviews/usuarios/${id}`} target='_blank'>
        <Chip avatar={<Avatar {...stringAvatar(name)} />} label={name} variant="outlined"/>
      </a>
    )
  }
  else{
    if(src){
      return (
        <Chip
            avatar={<Avatar {...stringAvatar(name)} alt={name} src={src} />}
            label={name}
            variant="outlined"
          />
      )
    }
  
    return (
      <Chip avatar={<Avatar {...stringAvatar(name)} />} label={name} variant="outlined"/>
    )
  }
}
