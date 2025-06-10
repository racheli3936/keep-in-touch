import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import heLocale from '@fullcalendar/core/locales/he';
import moment from 'moment';
import EventsStore from '../stores/EventsStore';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, IconButton, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import { categoryNames, EventsCalender } from '../types/types';
moment.locale('he');

const CalendarEvent = () => {
  const [events, setEvents] = useState<EventsCalender[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventsCalender>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const fetchEvents = async () => {
      await EventsStore.getEvevntByGroupId();
      const fetchedEvents: EventsCalender[] = EventsStore.Eventlist
        .filter(event => {
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
          return event.fileType && imageExtensions.some(ext => event.fileType.toString().endsWith(ext));
        })
        .map(event => {
          return {
            id: event.id,
            title: categoryNames[event.category],
            start: new Date(event.eventDate),
            end: new Date(new Date(event.eventDate).setHours(23, 59)),
            description: event.description,
            imageUrl: event.filePath || '/placeholder.jpg',
            originalDate: event.eventDate,
            backgroundColor: 'pink',
            borderColor: 'white',
            textColor: 'pink',
            extendedProps: {
              imageUrl: event.filePath,
              category: event.category
            }
          };
        });
      setEvents(fetchedEvents);
    };
    fetchEvents();
  }, []);
  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleClose = () => {
    setSelectedEvent(undefined);
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '2px 4px', borderRadius: '4px', overflow: 'hidden', width: '100%'}}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: isMobile ? '0.7rem' : '0.875rem'
          }}>
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  };

  // ===== עדכון הקוד עבור שימוש ללא גלילה פנימית =====
  return (
    <Box
      sx={{ p: 0, width: '80%', maxWidth: '100%', display: 'flex', flexDirection: 'column', mr: 0, ml: 0, mx: 'auto' }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: 700, color: theme.palette.primary.main, mb: 2, px: 2 }}>
        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
         לוח האירועים
      </Typography>

      <Paper
        elevation={6}
        sx={{ p: isMobile ? 1 : 2,
          borderRadius: 3, background: 'linear-gradient(to bottom, #ffffff, #f7fafd)',
          boxShadow: '0 8px 32px rgba(100, 100, 255, 0.1)', border: '1px solid rgba(220, 230, 255, 0.8)',
          width: '100%', mx: 'auto'}} >
        <Box sx={{
          '& .fc': {
            fontFamily: theme.typography.fontFamily,
            direction: 'rtl',
            width: '100%'
          },
          '& .fc-view': {
            width: '100% !important'
          },
          '& .fc-toolbar-title': {
            fontWeight: 700,
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            color: theme.palette.text.primary
          },
          '& .fc-button': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
            },
            '&:active, &.fc-button-active': {
              backgroundColor: `${theme.palette.primary.dark} !important`,
              borderColor: `${theme.palette.primary.dark} !important`,
              boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
            }
          },
          '& .fc-day-today': {
            backgroundColor: `${theme.palette.primary.light}30 !important`
          },
          '& .fc-event': {
            cursor: 'pointer',
            borderRadius: '6px',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.1s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          },
          '& .fc-daygrid-day-number': {
            padding: '8px',
            color: theme.palette.text.primary,
            fontWeight: 500
          },
          '& .fc-col-header-cell': {
            backgroundColor: theme.palette.grey[100],
            padding: '8px 0',
          },
          '& .fc-col-header-cell-cushion': {
            fontWeight: 700,
            color: theme.palette.primary.main,
            textDecoration: 'none !important'
          },
          width: '100%',
          '& .fc-scroller': {
            overflow: 'visible !important',
            height: 'auto !important'
          },
          // ביטול גלילה פנימית בכל תצוגות הלוח
          '& .fc-scroller-liquid-absolute': {
            position: 'static !important',
            overflow: 'visible !important',
            height: 'auto !important'
          },
          '& .fc-daygrid-body': {
            overflow: 'visible !important',
            height: 'auto !important'
          },
          '& .fc-scrollgrid': {
            overflow: 'visible !important',
            height: 'auto !important'
          },
          '& .fc-scrollgrid-section-body': {
            height: 'auto !important'
          },
          '& .fc-scrollgrid-sync-table': {
            height: 'auto !important'
          },
          // מניעת קיטוע הלוח
          '& .fc-view-harness': {
            height: 'auto !important',
            position: 'static !important'
          }
        }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            events={events as any}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            locale={heLocale}
            height="auto"
            // מניעת גלילה פנימית
            handleWindowResize={false}
            buttonText={{ today: 'היום', month: 'חודש', week: 'שבוע', day: 'יום' }}
          />
        </Box>
      </Paper>

      {selectedEvent && (
        <Dialog
          open={true}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', overflow: 'hidden' }
          }}>
          <DialogTitle sx={{ background: 'black', color: '#FF5722', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon />
              {selectedEvent.title}
            </Box>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {selectedEvent.extendedProps?.imageUrl && (
              <Box sx={{ position: 'relative', height: 200, width: '100%', overflow: 'hidden' }}>
                <img
                  src={selectedEvent.extendedProps?.imageUrl}
                  alt="Event"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                <Box sx={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white', p: 2
                }}>
                  <Chip
                    label={moment(selectedEvent.originalDate).format('dddd, DD/MM/YYYY')}
                    icon={<EventIcon />}
                    sx={{ backgroundColor: 'rgb(255, 255, 255)', color: '#333', fontWeight: 500 }} />
                </Box>
              </Box>
            )}

            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <DescriptionIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    תיאור:
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.description || 'אין מידע נוסף'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
            <Button onClick={handleClose} variant="contained"
              sx={{ backgroundColor: '#FF5729', '&:hover': { backgroundColor: '#9C27B0' }, borderRadius: 8, px: 3 }}>
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CalendarEvent;