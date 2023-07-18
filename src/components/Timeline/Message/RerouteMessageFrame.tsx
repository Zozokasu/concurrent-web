import { Box, IconButton, Typography } from '@mui/material'

import { type M_Reroute } from '@concurrent-world/client'
import RepeatIcon from '@mui/icons-material/Repeat'
import { CCAvatar } from '../../CCAvatar'
import { Link as routerLink } from 'react-router-dom'
import { TimeDiff } from '../../TimeDiff'
import { MessageContainer } from '../MessageContainer'

export interface RerouteMessageFrameProp {
    message: M_Reroute
    reloadMessage: () => void
    lastUpdated?: number
}

export const RerouteMessageFrame = (props: RerouteMessageFrameProp): JSX.Element => {
    return (
        <>
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                <Box
                    display="flex"
                    width={{ xs: '38px', sm: '48px' }}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <RepeatIcon sx={{ fontSize: '90%' }} />
                    <IconButton
                        sx={{
                            width: { xs: '12px', sm: '18px' },
                            height: { xs: '12px', sm: '18px' }
                        }}
                        component={routerLink}
                        to={'/entity/' + props.message.author.ccaddr}
                    >
                        <CCAvatar
                            avatarURL={props.message.author.profile?.avatar}
                            identiconSource={props.message.author.ccaddr}
                            sx={{
                                width: { xs: '12px', sm: '18px' },
                                height: { xs: '12px', sm: '18px' }
                            }}
                        />
                    </IconButton>
                </Box>
                <Typography
                    sx={{
                        fontSize: {
                            xs: '0.9rem',
                            sm: '1rem'
                        },
                        color: 'text.disabled',
                        fontWeight: 700,
                        flex: 1
                    }}
                >
                    {props.message.author.profile?.username || 'Anonymous'} rerouted{' '}
                    {props.message.body && 'with comment:'}
                </Typography>
                <Box color="text.disabled" fontSize="0.75rem">
                    <TimeDiff date={new Date(props.message.cdate)} />
                </Box>
            </Box>
            {props.message.body && (
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                    <Box display="flex" flexDirection="row-reverse" width={{ xs: '38px', sm: '48px' }} flexShrink={0} />
                    <Typography overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                        {props.message.body}
                    </Typography>
                </Box>
            )}
            <MessageContainer
                messageID={props.message.rerouteMessageId}
                messageOwner={props.message.rerouteMessageAuthor}
            />
        </>
    )
}