'use client'

import {Box, Stack, Typography, Button, Modal, TextField} from '@mui/material'
import { firestore } from '@/firebase'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [editItemName, setEditItemName] = useState('')
  const [editItemQuantity, setEditItemQuantity] = useState(1)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [itemToRemove, setItemToRemove] = useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenEdit = (item) => {
    setItemToEdit(item)
    setEditItemName(item.name)
    setEditItemQuantity(item.count)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => setOpenEdit(false)
  const handleOpenRemove = (item) => {
    setItemToRemove(item)
    setOpenRemove(true)
  }
  const handleCloseRemove = () => setOpenRemove(false)

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({"name": doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item, quantity) => {
    if (quantity < 0) quantity = 0; // Ensure quantity is not negative
    const itemLower = item.toLowerCase()
    const docRef = doc(collection(firestore, 'pantry'), itemLower)
    // Check if item exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + quantity})
    } else {
      await setDoc(docRef, {count: quantity})
    }
    await updatePantry()
  }

  const editItem = async (item, newName, newQuantity) => {
    if (newQuantity < 0) newQuantity = 0; // Ensure quantity is not negative
    const itemRef = doc(collection(firestore, 'pantry'), item.name.toLowerCase())
    const newItemRef = doc(collection(firestore, 'pantry'), newName.toLowerCase())

    if (item.name.toLowerCase() !== newName.toLowerCase()) {
      const newItemSnap = await getDoc(newItemRef)
      if (newItemSnap.exists()) {
        const { count } = newItemSnap.data()
        await setDoc(newItemRef, { count: count + newQuantity })
      } else {
        await setDoc(newItemRef, { count: newQuantity })
      }
      await deleteDoc(itemRef)
    } else {
      await setDoc(newItemRef, { count: newQuantity })
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item.toLowerCase())
    await deleteDoc(docRef)
    await updatePantry()
    handleCloseRemove()
  }

  const filteredPantry = pantry.filter(({name}) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <TextField 
              id="outlined-basic" 
              label="Quantity" 
              type="number" 
              variant="outlined" 
              fullWidth 
              value={itemQuantity} 
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setItemQuantity(value < 0 ? 0 : value)
              }}
            />
            <Button variant="outlined"
            onClick={() => {
              addItem(itemName, itemQuantity)
              setItemName('')
              setItemQuantity(1)
              handleClose()
            }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={editItemName} onChange={(e) => setEditItemName(e.target.value)}/>
            <TextField 
              id="outlined-basic" 
              label="Quantity" 
              type="number" 
              variant="outlined" 
              fullWidth 
              value={editItemQuantity} 
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setEditItemQuantity(value < 0 ? 0 : value)
              }}
            />
            <Button variant="outlined"
            onClick={() => {
              editItem(itemToEdit, editItemName, editItemQuantity)
              setEditItemName('')
              setEditItemQuantity(1)
              handleCloseEdit()
            }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    <Modal
        open={openRemove}
        onClose={handleCloseRemove}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Remove
          </Typography>
          <Typography id="modal-modal-description">
            Are you sure you want to remove this item?
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2} justifyContent={'flex-end'}>
            <Button variant="outlined" onClick={() => removeItem(itemToRemove.name)}>
              Yes
            </Button>
            <Button variant="outlined" onClick={handleCloseRemove}>
              No
            </Button>
          </Stack>
        </Box>
      </Modal>
    <Button variant="contained" onClick={handleOpen}>Add</Button>
    <Box border={'1px solid #333'}>
      <Box width="800px" height="100px" bgcolor={'#ADD8E6'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Pantry Items
        </Typography >
      </Box>
      <Box px={2} py={1}>
      <TextField 
          id="search-bar" 
          label="Search items in inventory..." 
          variant="outlined" 
          fullWidth 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Stack width ="800px" height="500px" spacing={2} overflow={'auto'}>
        {filteredPantry.map((item) => (
            <Box
              key={item.name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {
                  // Capitalize the first letter of the item
                  item.name.charAt(0).toUpperCase() + item.name.slice(1)
                }
              </Typography>

              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {item.count}
              </Typography>
            
            <Button variant="contained" onClick={() => handleOpenEdit(item)}>
              Edit
            </Button>
            <Button variant="contained" onClick={() => handleOpenRemove(item)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
}