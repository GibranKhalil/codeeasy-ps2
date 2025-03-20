import type { Snippet } from './types';

// Mock user data
export const mockUser = {
  id: 'user-123',
  email: 'demo@ps2hub.dev',
  user_metadata: {
    avatar_url: '/placeholder.svg?height=100&width=100',
    user_name: 'ps2dev',
  },
};

// Mock snippets data
export const mockSnippets: Snippet[] = [
  {
    id: 'snippet-1',
    title: 'PS2 Controller Input',
    description: 'How to read controller input on PS2 using the pad library',
    language: 'c',
    code: `// Sample code for reading PS2 controller input
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <libpad.h>

// Pad buffer
static char padBuf[2][256] __attribute__((aligned(64)));

// Initialize the controller
int initPad(int port, int slot) {
    int ret;
    int modes;
    int i;

    // Wait until the pad is stable
    do {
        ret = padGetState(port, slot);
    } while (ret != PAD_STATE_STABLE);

    // Get supported modes
    modes = padInfoMode(port, slot, PAD_MODETABLE, -1);
    
    // Set mode to DUALSHOCK
    if (modes & PAD_TYPE_DUALSHOCK)
        padSetMainMode(port, slot, PAD_MMODE_DUALSHOCK, PAD_MMODE_LOCK);

    return 1;
}

// Read pad data
int readPad(int port, int slot) {
    struct padButtonStatus buttons;
    u32 paddata;
    int ret;

    ret = padRead(port, slot, &buttons);
    
    if (ret != 0) {
        paddata = 0xffff ^ buttons.btns;
        return paddata;
    }
    
    return 0;
}

int main() {
    // Initialize SIF RPC
    SifInitRpc(0);
    
    // Initialize pad
    padInit(0);
    
    // Open pad port and slot
    padPortOpen(0, 0, padBuf[0]);
    
    // Initialize the first controller
    initPad(0, 0);
    
    // Main loop
    while(1) {
        // Read pad data
        u32 pad = readPad(0, 0);
        
        // Check button presses
        if (pad & PAD_CROSS)
            printf("Cross pressed\\n");
        if (pad & PAD_SQUARE)
            printf("Square pressed\\n");
        if (pad & PAD_TRIANGLE)
            printf("Triangle pressed\\n");
        if (pad & PAD_CIRCLE)
            printf("Circle pressed\\n");
            
        // Sleep to avoid hogging CPU
        nopdelay();
    }
    
    return 0;
}`,
    created_at: '2023-06-15T14:30:00Z',
    updated_at: '2023-06-15T14:30:00Z',
    user_id: 'user-123',
    user: {
      username: 'ps2dev',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-2',
    title: 'Graphics Rendering',
    description: 'Basic triangle rendering with GS (Graphics Synthesizer)',
    language: 'c',
    code: `// Sample code for PS2 graphics rendering
#include <tamtypes.h>
#include <kernel.h>
#include <gs_privileged.h>
#include <gs_psm.h>
#include <dma.h>
#include <dma_tags.h>
#include <gif_tags.h>

// Define screen dimensions
#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 448

// GS packet buffer
static u64 gs_dma_buffer[1024] __attribute__((aligned(64)));

// Initialize the GS
void init_gs(void) {
    // Set up the GS
    GS_SET_PMODE(
        0,      // Read Circuit 1
        1,      // Read Circuit 2
        0,      // Use ALP Register for Alpha Blending
        1,      // Alpha Value of Read Circuit 2
        0,      // Blend Alpha with Output of Read Circuit 2
        0xFF    // Alpha Value
    );
    
    // Set display mode
    GS_SET_DISPFB2(
        0,                  // Frame Buffer Base Pointer (Address/2048)
        SCREEN_WIDTH / 64,  // Buffer Width (Address/64)
        GS_PSM_32,          // Pixel Storage Format
        0,                  // Upper Left X in Buffer
        0                   // Upper Left Y in Buffer
    );
    
    // Set display area
    GS_SET_DISPLAY2(
        0,              // X Position in the Display Area
        0,              // Y Position in the Display Area
        SCREEN_WIDTH - 1,  // Display Width - 1
        SCREEN_HEIGHT - 1, // Display Height - 1
        0,              // Magnification in X Direction
        0               // Magnification in Y Direction
    );
    
    // Set background color
    GS_SET_BGCOLOR(
        0x00,   // Red
        0x00,   // Green
        0x00    // Blue
    );
}

// Draw a triangle
void draw_triangle(void) {
    // DMA buffer pointer
    u64 *dma_tag = gs_dma_buffer;
    u64 *dma_ptr = dma_tag;
    
    // GIF tag data
    *dma_ptr++ = DMA_TAG(6, 0, DMA_CNT, 0, 0, 0);
    *dma_ptr++ = 0;
    
    // Set primitive type to triangle
    *dma_ptr++ = GIF_TAG(4, 1, 0, 0, 0, 1);
    *dma_ptr++ = GIF_AD;
    
    // Set drawing attributes
    *dma_ptr++ = GS_SETREG_PRIM(GS_PRIM_TRIANGLE, 0, 0, 0, 0, 0, 0, 0, 0);
    *dma_ptr++ = GS_PRIM;
    
    // Set color (red)
    *dma_ptr++ = GS_SETREG_RGBAQ(255, 0, 0, 128, 0);
    *dma_ptr++ = GS_RGBAQ;
    
    // Vertex 1 (top)
    *dma_ptr++ = GS_SETREG_XYZ2(SCREEN_WIDTH/2 << 4, 100 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 2 (bottom left)
    *dma_ptr++ = GS_SETREG_XYZ2((SCREEN_WIDTH/2 - 100) << 4, 300 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 3 (bottom right)
    *dma_ptr++ = GS_SETREG_XYZ2((SCREEN_WIDTH/2 + 100) << 4, 300 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Send the DMA chain
    dma_channel_send_chain(DMA_CHANNEL_GIF, gs_dma_buffer, (dma_ptr - gs_dma_buffer) * sizeof(u64), 0, 0);
    dma_wait_fast();
}

int main(void) {
    // Initialize DMA
    dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
    
    // Initialize GS
    init_gs();
    
    // Draw a triangle
    draw_triangle();
    
    // Main loop
    while(1) {
        // Just wait
    }
    
    return 0;
}`,
    created_at: '2023-05-20T10:15:00Z',
    updated_at: '2023-05-20T10:15:00Z',
    user_id: 'user-456',
    user: {
      username: 'homebrew_master',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-3',
    title: 'Audio Playback',
    description: 'Playing audio files on PS2 using audsrv library',
    language: 'c',
    code: `// Sample code for PS2 audio playback
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <audsrv.h>
#include <stdio.h>

#define BUFFER_SIZE 4096

// Audio buffer
static char audio_buffer[BUFFER_SIZE] __attribute__((aligned(64)));

int main(void) {
    int ret;
    int played;
    FILE *wav;
    int fillbuffers = 1;
    
    // Initialize SIF RPC
    SifInitRpc(0);
    
    // Initialize audio server
    ret = audsrv_init();
    if (ret != 0) {
        printf("Failed to initialize audsrv\\n");
        return 1;
    }
    
    // Set audio format
    audsrv_set_format(AUDSRV_FMT_PCM);
    audsrv_set_volume(MAX_VOLUME);
    
    // Open WAV file (replace with your file path)
    wav = fopen("host:sound.wav", "rb");
    if (wav == NULL) {
        printf("Failed to open WAV file\\n");
        return 1;
    }
    
    // Skip WAV header (44 bytes)
    fseek(wav, 44, SEEK_SET);
    
    // Main playback loop
    while (fillbuffers) {
        // Read audio data
        ret = fread(audio_buffer, 1, BUFFER_SIZE, wav);
        if (ret > 0) {
            // Play audio data
            played = audsrv_play_audio(audio_buffer, ret);
        } else {
            // End of file
            fillbuffers = 0;
        }
        
        // Wait for audio to finish playing
        if (fillbuffers) {
            audsrv_wait_audio(ret);
        }
    }
    
    // Clean up
    fclose(wav);
    audsrv_quit();
    
    return 0;
}`,
    created_at: '2023-04-10T16:45:00Z',
    updated_at: '2023-04-10T16:45:00Z',
    user_id: 'user-789',
    user: {
      username: 'audio_wizard',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-4',
    title: 'Memory Card Access',
    description: 'Reading and writing to PS2 memory cards',
    language: 'c',
    code: `// Sample code for PS2 memory card access
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <libmc.h>
#include <stdio.h>
#include <string.h>

// Memory card buffer
static char mc_buffer[1024] __attribute__((aligned(64)));

int main(void) {
    int ret;
    int mc_fd;
    int mc_free = 0;
    int mc_format = 0;
    
    // Initialize SIF RPC
    SifInitRpc(0);
    
    // Initialize memory card library
    mcInit(MC_TYPE_XMC);
    
    // Wait for memory card to be ready
    while (!mc_format) {
        ret = mcGetInfo(0, 0, &mc_free, &mc_format, NULL);
        if (ret < 0) {
            printf("Error getting memory card info\\n");
            return 1;
        }
        
        mcSync(0, NULL, &ret);
    }
    
    // Create a file on the memory card
    mcMkDir(0, 0, "PS2HUB");
    mcSync(0, NULL, &ret);
    
    // Open a file for writing
    mc_fd = mcOpen(0, 0, "PS2HUB/SAVE.DAT", 1 | 0x200);
    mcSync(0, NULL, &mc_fd);
    
    if (mc_fd < 0) {
        printf("Error opening memory card file\\n");
        return 1;
    }
    
    // Prepare data to write
    strcpy(mc_buffer, "PS2 Homebrew Hub Save Data");
    
    // Write data to the file
    ret = mcWrite(mc_fd, mc_buffer, strlen(mc_buffer) + 1);
    mcSync(0, NULL, &ret);
    
    if (ret != (strlen(mc_buffer) + 1)) {
        printf("Error writing to memory card\\n");
        return 1;
    }
    
    // Close the file
    mcClose(mc_fd);
    mcSync(0, NULL, &ret);
    
    // Open the file for reading
    mc_fd = mcOpen(0, 0, "PS2HUB/SAVE.DAT", 1);
    mcSync(0, NULL, &mc_fd);
    
    if (mc_fd < 0) {
        printf("Error opening memory card file for reading\\n");
        return 1;
    }
    
    // Clear buffer
    memset(mc_buffer, 0, sizeof(mc_buffer));
    
    // Read data from the file
    ret = mcRead(mc_fd, mc_buffer, 1024);
    mcSync(0, NULL, &ret);
    
    // Display the read data
    printf("Read from memory card: %s\\n", mc_buffer);
    
    // Close the file
    mcClose(mc_fd);
    mcSync(0, NULL, &ret);
    
    return 0;
}`,
    created_at: '2023-03-05T09:30:00Z',
    updated_at: '2023-03-05T09:30:00Z',
    user_id: 'user-101',
    user: {
      username: 'graphics_guru',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-5',
    title: 'Network Programming',
    description: 'Basic TCP/IP networking on PS2 using ps2ip',
    language: 'c',
    code: `// Sample code for PS2 network programming
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <ps2ip.h>
#include <stdio.h>
#include <string.h>

// Network configuration
static char g_ip_address[16] = "192.168.1.100";
static char g_netmask[16] = "255.255.255.0";
static char g_gateway[16] = "192.168.1.1";
static char g_dns[16] = "192.168.1.1";

// HTTP request buffer
static char http_request[] = 
    "GET / HTTP/1.1\\r\\n"
    "Host: www.example.com\\r\\n"
    "Connection: close\\r\\n"
    "\\r\\n";

// Response buffer
static char response_buffer[4096];

int main(void) {
    int sock;
    int ret;
    struct sockaddr_in addr;
    
    // Initialize SIF RPC
    SifInitRpc(0);
    
    // Initialize network
    ps2ip_init();
    
    // Configure network
    ret = ps2ip_setconfig(g_ip_address, g_netmask, g_gateway, g_dns);
    if (ret < 0) {
        printf("Error configuring network\\n");
        return 1;
    }
    
    // Create socket
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        printf("Error creating socket\\n");
        return 1;
    }
    
    // Set up server address (example.com)
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(80);
    addr.sin_addr.s_addr = inet_addr("93.184.216.34"); // example.com IP
    
    // Connect to server
    ret = connect(sock, (struct sockaddr *)&addr, sizeof(addr));
    if (ret < 0) {
        printf("Error connecting to server\\n");
        return 1;
    }
    
    // Send HTTP request
    ret = send(sock, http_request, strlen(http_request), 0);
    if (ret < 0) {
        printf("Error sending HTTP request\\n");
        return 1;
    }
    
    // Receive response
    ret = recv(sock, response_buffer, sizeof(response_buffer) - 1, 0);
    if (ret < 0) {
        printf("Error receiving response\\n");
        return 1;
    }
    
    // Null-terminate the response
    response_buffer[ret] = '\\0';
    
    // Display response (first 100 chars)
    printf("Response: %.100s...\\n", response_buffer);
    
    // Close socket
    disconnect(sock);
    
    return 0;
}`,
    created_at: '2023-02-18T13:20:00Z',
    updated_at: '2023-02-18T13:20:00Z',
    user_id: 'user-202',
    user: {
      username: 'code_ninja',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-6',
    title: 'USB Access',
    description: 'Reading from USB devices on PS2',
    language: 'c',
    code: `// Sample code for PS2 USB access
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <usbd.h>
#include <stdio.h>
#include <string.h>

// USB device information
static UsbDeviceDescriptor dev_desc;
static UsbConfigDescriptor *conf_desc;
static UsbInterfaceDescriptor *int_desc;
static UsbEndpointDescriptor *ep_desc;

// USB driver
static int usb_driver_id = 0;

// USB callback function
void usb_callback(int result, int count, void *arg) {
    printf("USB transfer complete: %d bytes\\n", count);
}

// USB device probe
int usb_probe(int devId) {
    int ret;
    
    // Get device descriptor
    ret = UsbGetDeviceDescriptor(devId, &dev_desc);
    if (ret != USB_RC_OK) {
        printf("Error getting device descriptor\\n");
        return 0;
    }
    
    // Get configuration descriptor
    ret = UsbGetConfigDescriptor(devId, 0, &conf_desc);
    if (ret != USB_RC_OK) {
        printf("Error getting config descriptor\\n");
        return 0;
    }
    
    // Get interface descriptor
    int_desc = (UsbInterfaceDescriptor *)((char *)conf_desc + conf_desc->bLength);
    
    // Get endpoint descriptor
    ep_desc = (UsbEndpointDescriptor *)((char *)int_desc + int_desc->bLength);
    
    // Display device information
    printf("USB Device Found:\\n");
    printf("  VID: 0x%04X\\n", dev_desc.idVendor);
    printf("  PID: 0x%04X\\n", dev_desc.idProduct);
    printf("  Manufacturer: %d\\n", dev_desc.iManufacturer);
    printf("  Product: %d\\n", dev_desc.iProduct);
    printf("  Class: %d\\n", dev_desc.bDeviceClass);
    
    return 1;
}

// USB device connect
int usb_connect(int devId) {
    printf("USB device connected\\n");
    return 0;
}

// USB device disconnect
int usb_disconnect(int devId) {
    printf("USB device disconnected\\n");
    return 0;
}

int main(void) {
    int ret;
    
    // Initialize SIF RPC
    SifInitRpc(0);
    
    // Initialize USB
    ret = UsbInit();
    if (ret != USB_RC_OK) {
        printf("Error initializing USB\\n");
        return 1;
    }
    
    // Register USB driver
    UsbDriver driver = {
        NULL, NULL, // Next and prev pointers
        "PS2HUB_USB",
        USB_CLASS_PER_INTERFACE,
        USB_SUBCLASS_BOOT,
        USB_PROTOCOL_KEYBOARD,
        0, 0, 0, // Reserved
        usb_probe,
        usb_connect,
        usb_disconnect,
        NULL, NULL, NULL, NULL // Functions not used
    };
    
    ret = UsbRegisterDriver(&driver);
    if (ret != USB_RC_OK) {
        printf("Error registering USB driver\\n");
        return 1;
    }
    
    // Main loop
    printf("Waiting for USB devices...\\n");
    while(1) {
        // Just wait for USB events
        nopdelay();
    }
    
    return 0;
}`,
    created_at: '2023-01-25T11:10:00Z',
    updated_at: '2023-01-25T11:10:00Z',
    user_id: 'user-123',
    user: {
      username: 'ps2dev',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
  {
    id: 'snippet-7',
    title: '3D Model Loading',
    description: 'Loading and rendering 3D models on PS2',
    language: 'c',
    code: `// Sample code for loading and rendering 3D models on PS2
#include <tamtypes.h>
#include <kernel.h>
#include <gs_privileged.h>
#include <dma.h>
#include <dma_tags.h>
#include <gif_tags.h>
#include <math3d.h>
#include <stdio.h>

// Screen dimensions
#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 448

// Model data structure
typedef struct {
    VECTOR *vertices;
    VECTOR *normals;
    u32 *colors;
    int num_vertices;
    int num_triangles;
} Model;

// Camera position
VECTOR camera_position = {0.0f, 0.0f, -10.0f, 1.0f};
VECTOR camera_rotation = {0.0f, 0.0f, 0.0f, 1.0f};

// Model position
VECTOR model_position = {0.0f, 0.0f, 0.0f, 1.0f};
VECTOR model_rotation = {0.0f, 0.0f, 0.0f, 1.0f};

// Transformation matrices
MATRIX view_matrix;
MATRIX projection_matrix;
MATRIX world_matrix;
MATRIX work_matrix;

// DMA buffer
static u64 dma_buffer[1024] __attribute__((aligned(64)));

// Initialize the GS
void init_gs(void) {
    // Set up GS
    // ... (same as previous graphics example)
}

// Load a model from file
Model* load_model(const char *filename) {
    // In a real implementation, this would parse a model file
    // For this example, we'll create a simple cube
    
    Model *model = (Model*)malloc(sizeof(Model));
    
    // 8 vertices for a cube
    model->num_vertices = 8;
    model->vertices = (VECTOR*)malloc(sizeof(VECTOR) * model->num_vertices);
    model->normals = (VECTOR*)malloc(sizeof(VECTOR) * model->num_vertices);
    model->colors = (u32*)malloc(sizeof(u32) * model->num_vertices);
    
    // Define cube vertices
    // Front face
    model->vertices[0] = (VECTOR){-1.0f, -1.0f,  1.0f, 1.0f}; // Bottom-left
    model->vertices[1] = (VECTOR){ 1.0f, -1.0f,  1.0f, 1.0f}; // Bottom-right
    model->vertices[2] = (VECTOR){ 1.0f,  1.0f,  1.0f, 1.0f}; // Top-right
    model->vertices[3] = (VECTOR){-1.0f,  1.0f,  1.0f, 1.0f}; // Top-left
    
    // Back face
    model->vertices[4] = (VECTOR){-1.0f, -1.0f, -1.0f, 1.0f}; // Bottom-left
    model->vertices[5] = (VECTOR){ 1.0f, -1.0f, -1.0f, 1.0f}; // Bottom-right
    model->vertices[6] = (VECTOR){ 1.0f,  1.0f, -1.0f, 1.0f}; // Top-right
    model->vertices[7] = (VECTOR){-1.0f,  1.0f, -1.0f, 1.0f}; // Top-left
    
    // Set colors (RGBA)
    model->colors[0] = 0xFF0000FF; // Red
    model->colors[1] = 0x00FF00FF; // Green
    model->colors[2] = 0x0000FFFF; // Blue
    model->colors[3] = 0xFFFF00FF; // Yellow
    model->colors[4] = 0xFF00FFFF; // Magenta
    model->colors[5] = 0x00FFFFFF; // Cyan
    model->colors[6] = 0xFFFFFFFF; // White
    model->colors[7] = 0x888888FF; // Gray
    
    // 12 triangles (6 faces, 2 triangles per face)
    model->num_triangles = 12;
    
    return model;
}

// Set up the camera
void setup_camera(void) {
    // Create view matrix
    create_view_matrix(&view_matrix, &camera_position, &camera_rotation);
    
    // Create projection matrix (45 degree FOV)
    create_projection_matrix(&projection_matrix, 45.0f * (3.14159f / 180.0f), 
                            (float)SCREEN_WIDTH / (float)SCREEN_HEIGHT, 
                            0.1f, 1000.0f);
}

// Render a model
void render_model(Model *model) {
    int i;
    VECTOR transformed_vertices[8];
    
    // Create world matrix
    create_world_matrix(&world_matrix, &model_position, &model_rotation);
    
    // Combine matrices
    matrix_multiply(&work_matrix, &world_matrix, &view_matrix);
    matrix_multiply(&work_matrix, &work_matrix, &projection_matrix);
    
    // Transform vertices
    for (i = 0; i < model->num_vertices; i++) {
        vector_apply(&transformed_vertices[i], &model->vertices[i], &work_matrix);
    }
    
    // Render triangles
    // ... (code to send transformed vertices to GS)
}

int main(void) {
    // Initialize DMA
    dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
    
    // Initialize GS
    init_gs();
    
    // Load model
    Model *cube = load_model("cube.obj");
    
    // Setup camera
    setup_camera();
    
    // Main loop
    while(1) {
        // Update model rotation
        model_rotation.x += 0.01f;
        model_rotation.y += 0.02f;
        
        // Render model
        render_model(cube);
        
        // Wait for vsync
        graph_wait_vsync();
    }
    
    // Free resources when done
    free(cube->vertices);
    free(cube->normals);
    free(cube->colors);
    free(cube);
    
    return 0;
}`,
    created_at: '2023-01-10T08:45:00Z',
    updated_at: '2023-01-10T08:45:00Z',
    user_id: 'user-456',
    user: {
      username: 'homebrew_master',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
  },
];

// Mock top contributors data
export const mockTopContributors = [
  {
    id: 'user-123',
    username: 'ps2dev',
    avatar_url: '/placeholder.svg?height=100&width=100',
    snippets_count: 15,
  },
  {
    id: 'user-456',
    username: 'homebrew_master',
    avatar_url: '/placeholder.svg?height=100&width=100',
    snippets_count: 12,
  },
  {
    id: 'user-789',
    username: 'audio_wizard',
    avatar_url: '/placeholder.svg?height=100&width=100',
    snippets_count: 8,
  },
  {
    id: 'user-101',
    username: 'graphics_guru',
    avatar_url: '/placeholder.svg?height=100&width=100',
    snippets_count: 7,
  },
  {
    id: 'user-202',
    username: 'code_ninja',
    avatar_url: '/placeholder.svg?height=100&width=100',
    snippets_count: 5,
  },
];

// Mock tutorials data
export const mockTutorials = [
  {
    id: 'tutorial-1',
    title: 'Getting Started with PS2 Development',
    slug: 'getting-started-ps2-development',
    excerpt:
      'Learn how to set up your development environment and create your first PS2 homebrew project.',
    content: `
# Getting Started with PS2 Development

## Introduction

Welcome to the world of PlayStation 2 homebrew development! This tutorial will guide you through setting up your development environment and creating your first "Hello World" application for the PS2.

## Setting Up Your Development Environment

### Prerequisites

- A computer running Windows, Linux, or macOS
- Basic knowledge of C programming
- At least 2GB of free disk space

### Installing PS2DEV Toolchain

The PS2DEV toolchain is a collection of tools that allow you to build applications for the PlayStation 2. Follow these steps to set it up:

#### Windows

1. Download and install WSL2 (Windows Subsystem for Linux)
2. Install Ubuntu from the Microsoft Store
3. Open Ubuntu and run the following commands:

\`\`\`bash
sudo apt update
sudo apt install -y git make cmake autoconf automake bison flex libpng-dev
git clone https://github.com/ps2dev/ps2dev.git
cd ps2dev
./prepare-debian-ubuntu.sh
./toolchain.sh
\`\`\`

4. Add the PS2DEV environment variables to your .bashrc file:

\`\`\`bash
echo 'export PS2DEV=/usr/local/ps2dev' >> ~/.bashrc
echo 'export PS2SDK=$PS2DEV/ps2sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$PS2DEV/bin:$PS2DEV/ee/bin:$PS2DEV/iop/bin:$PS2DEV/dvp/bin:$PS2SDK/bin' >> ~/.bashrc
source ~/.bashrc
\`\`\`

#### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt update
sudo apt install -y git make cmake autoconf automake bison flex libpng-dev
git clone https://github.com/ps2dev/ps2dev.git
cd ps2dev
./prepare-debian-ubuntu.sh
./toolchain.sh
\`\`\`

Add the environment variables as described in the Windows section.

#### macOS

\`\`\`bash
brew install git make cmake autoconf automake bison flex libpng
git clone https://github.com/ps2dev/ps2dev.git
cd ps2dev
./toolchain.sh
\`\`\`

Add the environment variables to your .bash_profile or .zshrc file.

## Creating Your First PS2 Application

Now that we have the toolchain set up, let's create a simple "Hello World" program for the PS2.

Create a new directory for your project:

\`\`\`bash
mkdir hello_ps2
cd hello_ps2
\`\`\`

Create a file named main.c with the following content:

\`\`\`c
#include <tamtypes.h>
#include <kernel.h>
#include <debug.h>
#include <gs_privileged.h>

int main(void) {
    // Initialize the GS
    init_scr();
    
    // Print to screen
    scr_printf("Hello, PlayStation 2 World!\\n");
    
    // Wait for user input
    SleepThread();
    
    return 0;
}
\`\`\`

Now, create a Makefile with the following content:

\`\`\`makefile
EE_BIN = hello.elf
EE_OBJS = main.o
EE_LIBS = -ldebug

all: $(EE_BIN)

clean:
	rm -f $(EE_BIN) $(EE_OBJS)

include $(PS2SDK)/samples/Makefile.pref
include $(PS2SDK)/samples/Makefile.eeglobal
\`\`\`

Build your application:

\`\`\`bash
make
\`\`\`

If everything went correctly, you should now have a hello.elf file that can be run on a PS2 with homebrew support or an emulator like PCSX2.

## Running Your Application

### On a Real PS2

To run your application on a real PS2, you'll need:

1. A PlayStation 2 with FreeMcBoot installed
2. A way to transfer your ELF file to the PS2 (USB drive, memory card, or network)

Copy your hello.elf file to a USB drive or memory card, then use uLaunchELF on your PS2 to execute it.

### On PCSX2 Emulator

1. Download and install PCSX2
2. Run PCSX2 and go to System > Run ELF
3. Navigate to your hello.elf file and select it

## Next Steps

Now that you've set up your development environment and created your first application, you can start exploring more complex PS2 programming topics:

- Graphics with the Graphics Synthesizer (GS)
- Audio with SPU2
- Input handling
- File I/O with memory cards
- Network programming

Check out our other tutorials to learn more about these topics.

Happy coding!
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-123',
      username: 'ps2dev',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Beginner',
    tags: ['setup', 'hello-world', 'toolchain'],
    created_at: '2023-05-15T08:00:00Z',
    updated_at: '2023-06-01T10:30:00Z',
    read_time: 10, // minutes
  },
  {
    id: 'tutorial-2',
    title: 'PS2 Graphics Programming: Basics',
    slug: 'ps2-graphics-programming-basics',
    excerpt:
      'Learn the fundamentals of PS2 graphics programming with the Graphics Synthesizer (GS).',
    content: `
# PS2 Graphics Programming: Basics

## Introduction

The PlayStation 2's Graphics Synthesizer (GS) is a powerful GPU that was quite advanced for its time. In this tutorial, we'll explore the basics of PS2 graphics programming, focusing on how to initialize the GS and render simple shapes.

## Understanding the PS2 Graphics Pipeline

The PS2 graphics system consists of several components:

1. **Graphics Synthesizer (GS)**: The actual GPU that renders graphics
2. **Vector Unit 0 (VU0)**: Can be used for graphics calculations
3. **Vector Unit 1 (VU1)**: Primarily used as a geometry processor
4. **Emotion Engine (EE)**: The main CPU that coordinates everything

For beginners, we'll focus on using the EE to communicate with the GS directly, without utilizing the vector units for simplicity.

## Setting Up the Graphics System

First, let's set up the basic graphics system. Create a new project and add the following code:

\`\`\`c
#include <tamtypes.h>
#include <kernel.h>
#include <gs_privileged.h>
#include <dma.h>
#include <dma_tags.h>
#include <gif_tags.h>

// Define screen dimensions
#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 448

// GS packet buffer
static u64 gs_dma_buffer[1024] __attribute__((aligned(64)));

// Initialize the GS
void init_gs(void) {
    // Set up the GS
    GS_SET_PMODE(
        0,      // Read Circuit 1
        1,      // Read Circuit 2
        0,      // Use ALP Register for Alpha Blending
        1,      // Alpha Value of Read Circuit 2
        0,      // Blend Alpha with Output of Read Circuit 2
        0xFF    // Alpha Value
    );
    
    // Set display mode
    GS_SET_DISPFB2(
        0,                  // Frame Buffer Base Pointer (Address/2048)
        SCREEN_WIDTH / 64,  // Buffer Width (Address/64)
        GS_PSM_32,          // Pixel Storage Format
        0,                  // Upper Left X in Buffer
        0                   // Upper Left Y in Buffer
    );
    
    // Set display area
    GS_SET_DISPLAY2(
        0,              // X Position in the Display Area
        0,              // Y Position in the Display Area
        SCREEN_WIDTH - 1,  // Display Width - 1
        SCREEN_HEIGHT - 1, // Display Height - 1
        0,              // Magnification in X Direction
        0               // Magnification in Y Direction
    );
    
    // Set background color (black)
    GS_SET_BGCOLOR(
        0x00,   // Red
        0x00,   // Green
        0x00    // Blue
    );
}

int main(void) {
    // Initialize DMA
    dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
    
    // Initialize GS
    init_gs();
    
    // Main loop
    while(1) {
        // We'll add drawing code here later
    }
    
    return 0;
}
\`\`\`

This code sets up the GS with a 640x448 display, which is a common resolution for PS2 games.

## Drawing a Triangle

Now, let's draw a simple triangle on the screen:

\`\`\`c
// Draw a triangle
void draw_triangle(void) {
    // DMA buffer pointer
    u64 *dma_tag = gs_dma_buffer;
    u64 *dma_ptr = dma_tag;
    
    // GIF tag data
    *dma_ptr++ = DMA_TAG(6, 0, DMA_CNT, 0, 0, 0);
    *dma_ptr++ = 0;
    
    // Set primitive type to triangle
    *dma_ptr++ = GIF_TAG(4, 1, 0, 0, 0, 1);
    *dma_ptr++ = GIF_AD;
    
    // Set drawing attributes
    *dma_ptr++ = GS_SETREG_PRIM(GS_PRIM_TRIANGLE, 0, 0, 0, 0, 0, 0, 0, 0);
    *dma_ptr++ = GS_PRIM;
    
    // Set color (red)
    *dma_ptr++ = GS_SETREG_RGBAQ(255, 0, 0, 128, 0);
    *dma_ptr++ = GS_RGBAQ;
    
    // Vertex 1 (top)
    *dma_ptr++ = GS_SETREG_XYZ2(SCREEN_WIDTH/2 << 4, 100 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 2 (bottom left)
    *dma_ptr++ = GS_SETREG_XYZ2((SCREEN_WIDTH/2 - 100) << 4, 300 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 3 (bottom right)
    *dma_ptr++ = GS_SETREG_XYZ2((SCREEN_WIDTH/2 + 100) << 4, 300 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Send the DMA chain
    dma_channel_send_chain(DMA_CHANNEL_GIF, gs_dma_buffer, (dma_ptr - gs_dma_buffer) * sizeof(u64), 0, 0);
    dma_wait_fast();
}
\`\`\`

Now, add this function call to your main loop:

\`\`\`c
int main(void) {
    // Initialize DMA
    dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
    
    // Initialize GS
    init_gs();
    
    // Main loop
    while(1) {
        // Draw the triangle
        draw_triangle();
        
        // Wait for vsync
        graph_wait_vsync();
    }
    
    return 0;
}
\`\`\`

This code draws a red triangle in the center of the screen.

## Understanding the Code

Let's break down what's happening:

1. We create a DMA (Direct Memory Access) buffer for our graphics commands
2. We set up a GIF (Graphics Interface) tag, which tells the GS what kind of data we're sending
3. We set the primitive type to a triangle
4. We set the color to red
5. We define the three vertices of our triangle
6. We send the data to the GS using DMA
7. We wait for the vertical sync to avoid screen tearing

## Adding Animation

Let's make our triangle rotate to add some animation:

\`\`\`c
// Draw a rotating triangle
void draw_rotating_triangle(float angle) {
    // Center of the screen
    int center_x = SCREEN_WIDTH / 2;
    int center_y = SCREEN_HEIGHT / 2;
    
    // Radius
    float radius = 100.0f;
    
    // Calculate vertex positions
    int x1 = center_x + (int)(radius * sin(angle));
    int y1 = center_y + (int)(radius * cos(angle));
    
    int x2 = center_x + (int)(radius * sin(angle + 2.0f * 3.14159f / 3.0f));
    int y2 = center_y + (int)(radius * cos(angle + 2.0f * 3.14159f / 3.0f));
    
    int x3 = center_x + (int)(radius * sin(angle + 4.0f * 3.14159f / 3.0f));
    int y3 = center_y + (int)(radius * cos(angle + 4.0f * 3.14159f / 3.0f));
    
    // DMA buffer pointer
    u64 *dma_tag = gs_dma_buffer;
    u64 *dma_ptr = dma_tag;
    
    // GIF tag data
    *dma_ptr++ = DMA_TAG(6, 0, DMA_CNT, 0, 0, 0);
    *dma_ptr++ = 0;
    
    // Set primitive type to triangle
    *dma_ptr++ = GIF_TAG(4, 1, 0, 0, 0, 1);
    *dma_ptr++ = GIF_AD;
    
    // Set drawing attributes
    *dma_ptr++ = GS_SETREG_PRIM(GS_PRIM_TRIANGLE, 0, 0, 0, 0, 0, 0, 0, 0);
    *dma_ptr++ = GS_PRIM;
    
    // Set color (changing with angle)
    int r = (int)(128.0f + 127.0f * sin(angle));
    int g = (int)(128.0f + 127.0f * sin(angle + 2.0f));
    int b = (int)(128.0f + 127.0f * sin(angle + 4.0f));
    
    *dma_ptr++ = GS_SETREG_RGBAQ(r, g, b, 128, 0);
    *dma_ptr++ = GS_RGBAQ;
    
    // Vertex 1
    *dma_ptr++ = GS_SETREG_XYZ2(x1 << 4, y1 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 2
    *dma_ptr++ = GS_SETREG_XYZ2(x2 << 4, y2 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Vertex 3
    *dma_ptr++ = GS_SETREG_XYZ2(x3 << 4, y3 << 4, 0);
    *dma_ptr++ = GS_XYZ2;
    
    // Send the DMA chain
    dma_channel_send_chain(DMA_CHANNEL_GIF, gs_dma_buffer, (dma_ptr - gs_dma_buffer) * sizeof(u64), 0, 0);
    dma_wait_fast();
}

int main(void) {
    // Initialize DMA
    dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
    
    // Initialize GS
    init_gs();
    
    // Angle for rotation
    float angle = 0.0f;
    
    // Main loop
    while(1) {
        // Clear the screen (optional)
        // ...
        
        // Draw the rotating triangle
        draw_rotating_triangle(angle);
        
        // Increment angle
        angle += 0.01f;
        if (angle > 2.0f * 3.14159f) {
            angle -= 2.0f * 3.14159f;
        }
        
        // Wait for vsync
        graph_wait_vsync();
    }
    
    return 0;
}
\`\`\`

This code creates a rotating triangle that also changes color as it rotates.

## Conclusion

In this tutorial, we've covered the basics of PS2 graphics programming:

1. Initializing the Graphics Synthesizer
2. Creating and sending DMA packets
3. Drawing a simple triangle
4. Adding animation

This is just the beginning of what you can do with PS2 graphics. In future tutorials, we'll explore more advanced topics such as texturing, lighting, and 3D geometry.

Remember that PS2 graphics programming can be quite low-level compared to modern graphics APIs, but this gives you a lot of control over the hardware and can lead to some impressive results once you master it.

Happy coding!
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-101',
      username: 'graphics_guru',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Graphics',
    tags: ['graphics', 'gs', 'triangles', 'rendering'],
    created_at: '2023-04-20T14:45:00Z',
    updated_at: '2023-05-05T09:15:00Z',
    read_time: 15, // minutes
  },
  {
    id: 'tutorial-3',
    title: 'PS2 Audio Programming with IOP',
    slug: 'ps2-audio-programming-iop',
    excerpt:
      'Learn how to create and play audio on the PS2 using the IO Processor (IOP) and SPU2.',
    content: `
# PS2 Audio Programming with IOP

This is a detailed tutorial on PS2 audio programming...
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-789',
      username: 'audio_wizard',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Audio',
    tags: ['audio', 'iop', 'spu2', 'sound'],
    created_at: '2023-03-10T11:30:00Z',
    updated_at: '2023-03-25T16:20:00Z',
    read_time: 12, // minutes
  },
  {
    id: 'tutorial-4',
    title: 'Memory Card Access and File I/O on PS2',
    slug: 'memory-card-access-file-io-ps2',
    excerpt: 'Complete guide to reading and writing data to PS2 memory cards.',
    content: `
# Memory Card Access and File I/O on PS2

This is a detailed tutorial on PS2 memory card programming...
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-123',
      username: 'ps2dev',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'File I/O',
    tags: ['memory-card', 'file-io', 'save-data'],
    created_at: '2023-02-15T09:00:00Z',
    updated_at: '2023-02-28T13:40:00Z',
    read_time: 8, // minutes
  },
  {
    id: 'tutorial-5',
    title: 'Network Programming on PS2',
    slug: 'network-programming-ps2',
    excerpt:
      'Learn how to add networking capabilities to your PS2 homebrew applications.',
    content: `
# Network Programming on PS2

This is a detailed tutorial on PS2 network programming...
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-202',
      username: 'code_ninja',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Networking',
    tags: ['network', 'tcp-ip', 'online'],
    created_at: '2023-01-05T16:15:00Z',
    updated_at: '2023-01-20T10:30:00Z',
    read_time: 14, // minutes
  },
  {
    id: 'tutorial-6',
    title: 'USB Access on PS2',
    slug: 'usb-access-ps2',
    excerpt: 'Guide to interfacing with USB devices on the PlayStation 2.',
    content: `
# USB Access on PS2

This is a detailed tutorial on PS2 USB programming...
    `,
    coverImage: '/placeholder.svg?height=600&width=1200',
    author: {
      id: 'user-456',
      username: 'homebrew_master',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Hardware',
    tags: ['usb', 'hardware', 'devices'],
    created_at: '2022-12-10T08:45:00Z',
    updated_at: '2022-12-28T14:20:00Z',
    read_time: 10, // minutes
  },
];

// Mock games data
export const mockGames = [
  {
    id: 'game-1',
    title: 'PS2D: 2D Platformer Engine',
    slug: 'ps2d-2d-platformer-engine',
    description:
      'A complete 2D platform game engine for PS2, featuring sprite animation, physics, and level editor.',
    content: `
# PS2D: 2D Platformer Engine

## Overview

PS2D is a comprehensive 2D platformer engine built specifically for the PlayStation 2. It provides developers with all the tools needed to create high-quality 2D platform games without having to manage the low-level details of the PS2 hardware.

## Features

- Sprite-based animation system
- Integrated physics engine with collision detection
- Tile-based level system
- Particle effects system
- Audio playback for sound effects and music
- Controller input handling
- Memory card save/load functionality
- Included level editor (runs on PC, exports to PS2 format)

## System Requirements

- PlayStation 2 console with Free McBoot or other means to run homebrew
- At least 1 controller
- Memory card (8MB) for saving game progress
- (Optional) USB devices supported for custom levels

## Installation

1. Download the PS2D.zip file
2. Extract the contents to a USB drive
3. Copy the PS2D folder to your PS2 memory card or USB drive
4. Launch the engine using uLaunchELF or similar homebrew launcher

## Getting Started

The engine comes with a sample game that demonstrates the capabilities of PS2D. To run it, simply:

1. Launch PS2D from your homebrew launcher
2. Select "Run Sample Game" from the main menu
3. Use the D-pad to move, X to jump, and Square to attack

## Creating Your Own Game

The engine includes documentation and examples to help you create your own game. The basic workflow is:

1. Design your levels using the included level editor
2. Create or import sprite sheets for your characters and objects
3. Define the game mechanics and physics parameters
4. Test and iterate!

## Technical Details

- Written in C with some assembly optimizations
- Uses the PS2's Graphics Synthesizer for rendering
- Implements a custom memory manager to optimize PS2's RAM usage
- Supports up to 1024 sprite animations simultaneously
- Can handle levels up to 16,384 x 2,048 tiles

## Screenshots

(Screenshots would be included here)

## Credits

Developed by homebrew_master
Graphics by pixel_artist
Sound by audio_wizard

## License

This software is released under the GPL v3 license. See the LICENSE file for details.

## Contact

For support, feature requests, or bug reports, please contact us at:
ps2d-engine@example.com
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-456',
      username: 'homebrew_master',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Engines',
    tags: ['2d', 'platformer', 'engine', 'game-engine'],
    created_at: '2023-05-10T09:30:00Z',
    updated_at: '2023-06-15T14:45:00Z',
    download_url: '#',
    download_count: 1250,
    size_mb: 4.2,
    version: '1.2.0',
  },
  {
    id: 'game-2',
    title: 'PS2 Tetris Deluxe',
    slug: 'ps2-tetris-deluxe',
    description:
      'An enhanced version of the classic Tetris game for PlayStation 2 with new game modes and multiplayer options.',
    content: `
# PS2 Tetris Deluxe

## About

PS2 Tetris Deluxe is an enhanced version of the classic Tetris game for the PlayStation 2. It features all the traditional Tetris gameplay you know and love, plus new game modes, multiplayer options, and visual effects that take advantage of the PS2's hardware.

## Game Modes

- **Classic Mode**: The original Tetris gameplay
- **Sprint Mode**: Clear 40 lines as quickly as possible
- **Ultra Mode**: Score as many points as possible in 3 minutes
- **Marathon Mode**: Play until you reach level 15
- **Battle Mode**: Compete against another player or the AI
- **Puzzle Mode**: Solve specific Tetris puzzles

## Multiplayer

- 2-player split-screen competitive play
- 2-4 player tournament mode (hot seat)
- Custom battle rules and settings

## Features

- HD graphics (for PS2 standards)
- Custom soundtrack
- Unlockable block skins and backgrounds
- Detailed statistics tracking
- Ghost piece functionality
- Hold piece feature
- Next piece queue display
- Multiple difficulty levels

## Controls

- D-pad: Move piece left/right
- X button: Rotate clockwise
- Square button: Rotate counter-clockwise
- Circle button: Hold piece
- Triangle button: Quick swap with hold piece
- R1 button: Soft drop
- R2 button: Hard drop
- L1 button: Show next pieces
- L2 button: Quick save
- Start button: Pause game

## Installation

1. Download the PS2TetrisDeluxe.zip file
2. Extract to a USB drive or burn to a CD-R
3. Load the game using your preferred PS2 homebrew method

## System Requirements

- PlayStation 2 console with Free McBoot or similar
- At least one controller
- Memory card for saving high scores and progress (8MB recommended)
- (Optional) Second controller for multiplayer modes

## Credits

Developed by ps2dev
Music by audio_wizard
Graphics by graphics_guru
Special thanks to the PS2 homebrew community

## License

This game is open source and released under the MIT License.
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-123',
      username: 'ps2dev',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Puzzle',
    tags: ['tetris', 'puzzle', 'arcade', 'multiplayer'],
    created_at: '2023-04-05T15:20:00Z',
    updated_at: '2023-04-20T11:10:00Z',
    download_url: '#',
    download_count: 3750,
    size_mb: 2.8,
    version: '2.1.0',
  },
  {
    id: 'game-3',
    title: 'PS2 Racing Evolution',
    slug: 'ps2-racing-evolution',
    description:
      "A high-speed 3D racing game showcasing the PS2's graphics capabilities with multiple tracks and vehicles.",
    content: `
# PS2 Racing Evolution

## Description

PS2 Racing Evolution is a high-speed 3D racing game that showcases the PlayStation 2's graphics capabilities. It features multiple tracks, vehicles, and racing modes that will test your driving skills.

## Features

- 10 unique tracks across different environments
- 8 customizable vehicles with different performance characteristics
- Single-player championship mode
- Time trial mode
- Split-screen multiplayer for up to 2 players
- Realistic physics engine
- Dynamic weather effects
- Day/night cycle
- Damage model affecting vehicle performance
- Garage mode for vehicle upgrades and tuning

## Technical Showcase

This game demonstrates several advanced PS2 programming techniques:

- Efficient use of Vector Units for physics calculations
- Adaptive level of detail system for maintaining high frame rates
- Custom shader effects for vehicle paint and reflections
- Optimized track rendering using custom visibility culling
- Advanced particle system for weather, smoke, and debris

## Controls

- Left analog stick: Steering
- X button: Accelerate
- Square button: Brake/Reverse
- L1/R1: Look behind/Use rear view
- L2/R2: Shift down/Shift up (manual transmission)
- Triangle: Change camera view
- Circle: Handbrake
- Select: Toggle mini-map
- Start: Pause menu

## Installation

1. Download the PS2RacingEvolution.zip file
2. Extract to a USB drive
3. Transfer to your PS2 memory card or run directly from USB
4. Launch using your preferred homebrew method

## System Requirements

- PlayStation 2 console
- DualShock 2 controller
- Memory card for saving game progress (at least 2MB free)
- Component cables recommended for best visual experience

## Credits

- Programming: graphics_guru
- 3D Models: model_master
- Track Design: level_designer
- Physics Engine: math_wizard
- Sound Effects: audio_wizard
- Music: chiptune_composer

## License

This is open-source software released under the GPLv3 license.
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-101',
      username: 'graphics_guru',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Racing',
    tags: ['racing', '3d', 'vehicles', 'multiplayer'],
    created_at: '2023-03-15T10:45:00Z',
    updated_at: '2023-03-30T16:20:00Z',
    download_url: '#',
    download_count: 2100,
    size_mb: 8.5,
    version: '1.5.0',
  },
  {
    id: 'game-4',
    title: 'PS2 RPG Framework',
    slug: 'ps2-rpg-framework',
    description:
      'A complete RPG game engine for PS2 with battle system, inventory management, and quest tracking.',
    content: `
# PS2 RPG Framework

## Overview

PS2 RPG Framework is a comprehensive game engine designed specifically for creating role-playing games on the PlayStation 2. Whether you're looking to build a JRPG-style game with turn-based combat or an action RPG with real-time battles, this framework provides all the essential systems you need.

## Key Features

- Character stats and progression system
- Turn-based battle system with customizable rules
- Real-time battle system option
- Inventory management with equipment, consumables, and key items
- Quest tracking system
- Dialogue and cutscene engine
- World map navigation
- Town/dungeon exploration
- Save/load system using memory cards
- Menu UI system with customizable themes
- Random encounter system with configurable rates
- Experience points and leveling mechanism
- NPC interaction system
- Shop and economy system

## Technical Details

- Written in C with assembly optimizations for critical sections
- Efficient memory management for large game worlds
- Support for pre-rendered backgrounds and 3D character models
- Optimized sprite batching for UI elements
- Streamlined asset pipeline

## Getting Started

The framework includes a sample RPG game that demonstrates all the core features. To get started:

1. Run the sample game to see the framework in action
2. Check the documentation folder for API references and tutorials
3. Use the included world editor to create your own maps
4. Customize the battle system parameters to match your game design
5. Import your own assets or use the included placeholder graphics

## Documentation

Comprehensive documentation is included in the docs folder, covering:

- System architecture overview
- API reference for all components
- Tutorial for creating a basic RPG
- Asset creation guidelines
- Performance optimization tips

## Requirements

- PlayStation 2 console with homebrew capabilities
- At least one DualShock controller
- Memory card for saving games
- Basic knowledge of C programming

## Credits

Developed by code_ninja
Battle system design by tactical_master
UI system by interface_designer
Documentation by technical_writer

## License

This framework is released under the MIT license. See LICENSE.txt for details.

## Contact

For support, feature requests, or contributions, please contact:
ps2rpgframework@example.com
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-202',
      username: 'code_ninja',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'RPG',
    tags: ['rpg', 'framework', 'engine', 'turn-based'],
    created_at: '2023-02-20T13:15:00Z',
    updated_at: '2023-03-10T09:40:00Z',
    download_url: '#',
    download_count: 1850,
    size_mb: 6.2,
    version: '1.3.2',
  },
  {
    id: 'game-5',
    title: 'Audio Synthesizer for PS2',
    slug: 'audio-synthesizer-ps2',
    description:
      'A powerful audio tool that turns your PS2 into a music synthesizer with various sound capabilities.',
    content: `
# Audio Synthesizer for PS2

## Introduction

The Audio Synthesizer for PS2 transforms your PlayStation 2 console into a powerful music creation tool. It utilizes the PS2's SPU2 sound processor to generate a wide range of synthesized sounds, beats, and effects. Whether you're a musician looking for unique sounds or a homebrew developer wanting to add music to your projects, this tool provides an accessible interface for audio creation directly on the PS2.

## Features

- 16-voice polyphonic synthesizer
- 4 independent sound generators (sine, square, sawtooth, noise)
- Envelope control (ADSR)
- Filter effects (low-pass, high-pass, band-pass)
- Reverb and delay effects
- Drum machine with programmable patterns
- 16-step sequencer
- MIDI file import/export
- WAV/AIFF sample import
- Recording function to save your creations
- USB MIDI controller support

## Interface

The synthesizer features a user-friendly interface that can be fully controlled with the PS2 controller:

- Left analog stick: Navigate menus and adjust parameters
- Right analog stick: Fine-tune parameters
- D-pad: Switch between different sections
- Face buttons: Select options and trigger sounds
- Shoulder buttons: Switch between banks/presets
- Start/Select: Access special functions

## Sound Banks

The synthesizer comes with 64 built-in sound presets across 8 categories:

1. Classic Synth Leads
2. Bass Sounds
3. Pad/Atmosphere
4. Percussion
5. Organ/Keys
6. Strings
7. Electronic/Dance
8. Sound Effects

## Recording and Exporting

Your creations can be:
- Recorded in real-time
- Saved to memory card as .WAV files
- Exported via USB to a computer
- Used directly in other PS2 homebrew applications

## System Requirements

- PlayStation 2 console with Free McBoot or other means of running homebrew
- DualShock 2 controller
- Memory card (at least 8MB free for recordings)
- (Optional) USB MIDI controller for enhanced input
- (Optional) USB drive for exporting recordings

## Technical Implementation

This synthesizer showcases the audio capabilities of the PS2 by:
- Directly programming the SPU2 sound processor
- Utilizing the IOP (I/O Processor) for low-latency audio processing
- Implementing real-time DSP algorithms on the Emotion Engine
- Optimizing memory usage for complex sound manipulations

## Installation

1. Download the AudioSynthPS2.zip package
2. Extract to a USB drive
3. Copy to your PS2 memory card or run directly from USB
4. Launch using your preferred homebrew method

## Credits

Developed by audio_wizard
UI Design by interface_designer
Additional programming by code_ninja

## License

This software is released under the GPLv3 license.

## Contact

For questions, feature requests, or to share your creations:
audiosynth.ps2@example.com
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-789',
      username: 'audio_wizard',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Audio',
    tags: ['audio', 'synthesizer', 'music', 'tool'],
    created_at: '2023-01-25T11:30:00Z',
    updated_at: '2023-02-15T14:15:00Z',
    download_url: '#',
    download_count: 1400,
    size_mb: 3.7,
    version: '2.0.1',
  },
  {
    id: 'game-6',
    title: 'PS2 Chess Master',
    slug: 'ps2-chess-master',
    description:
      'A feature-rich chess game for PS2 with multiple difficulty levels and play modes.',
    content: `
# PS2 Chess Master

## About

PS2 Chess Master is a comprehensive chess game for the PlayStation 2 that offers both beginners and experienced players a challenging and enjoyable chess experience. With multiple difficulty levels, tutorial modes, and classic gameplay, it's perfect for chess enthusiasts of all skill levels.

## Game Features

- Classic chess gameplay with full rule implementation
- 10 AI difficulty levels from beginner to grandmaster
- 2-player mode for playing against friends
- Tutorial mode for learning chess fundamentals
- Puzzle mode with 100+ chess problems to solve
- Game analysis tools to review your matches
- Opening book with 1000+ classic openings
- Game save/load functionality
- Tournament mode
- Detailed statistics tracking
- Customizable board and piece themes

## AI Engine

The chess AI engine uses several advanced algorithms:

- Alpha-beta pruning with iterative deepening
- Opening book with over 1000 classic openings
- Endgame tablebase for perfect endgame play
- Dynamic evaluation function
- Adaptive difficulty that learns from your play style

## Controls

- D-pad/Analog stick: Move cursor
- X button: Select piece/square
- Circle button: Cancel selection
- Triangle button: Hint
- Square button: Show legal moves
- L1/R1: Undo/Redo move
- L2/R2: Rotate board view
- Select: Game options menu
- Start: Pause/Main menu

## Game Modes

- **Standard Game**: Classic chess match against AI or another player
- **Tournament**: Compete in a series of matches with increasing difficulty
- **Puzzle Mode**: Solve chess puzzles within a limited number of moves
- **Tutorial**: Learn the rules and strategies of chess
- **Analysis**: Review your games with move-by-move analysis

## Installation

1. Download the PS2ChessMaster.zip file
2. Extract to a USB drive or memory card
3. Run using your preferred PS2 homebrew method

## System Requirements

- PlayStation 2 console
- DualShock controller
- Memory card for saving games (at least 1MB free)

## Credits

- Programming: code_ninja
- Chess Engine: chess_master
- Graphics: pixel_artist
- Sound: audio_designer

## License

This game is released under the MIT License.
    `,
    screenshots: [
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
      '/placeholder.svg?height=720&width=1280',
    ],
    coverImage: '/placeholder.svg?height=720&width=1280',
    author: {
      id: 'user-202',
      username: 'code_ninja',
      avatar_url: '/placeholder.svg?height=100&width=100',
    },
    category: 'Board Games',
    tags: ['chess', 'board-game', 'strategy', '2-player'],
    created_at: '2022-12-18T10:15:00Z',
    updated_at: '2023-01-10T16:40:00Z',
    download_url: '#',
    download_count: 1650,
    size_mb: 1.8,
    version: '1.4.0',
  },
];

// Mock donation methods
export const mockDonationMethods = [
  {
    id: 'donation-paypal',
    name: 'PayPal',
    description: 'Quick and secure donations via PayPal',
    icon: 'credit-card',
    url: '#paypal',
  },
  {
    id: 'donation-crypto',
    name: 'Cryptocurrency',
    description: 'Donate using Bitcoin, Ethereum, or other cryptocurrencies',
    icon: 'bitcoin',
    url: '#crypto',
  },
  {
    id: 'donation-patreon',
    name: 'Patreon',
    description: 'Become a monthly supporter and get exclusive benefits',
    icon: 'heart',
    url: '#patreon',
  },
  {
    id: 'donation-github',
    name: 'GitHub Sponsors',
    description: 'Support developers directly through GitHub Sponsors',
    icon: 'github',
    url: '#github',
  },
];

// Mock featured developers for donations
export const mockFeaturedDevelopers = [
  {
    id: 'user-123',
    username: 'ps2dev',
    avatar_url: '/placeholder.svg?height=100&width=100',
    bio: 'PS2 homebrew developer and enthusiast. Working on graphics and input libraries.',
    projects: ['PS2 Tetris Deluxe', 'MemCard PRO', 'USB Loader'],
    donation_url: '#ps2dev',
  },
  {
    id: 'user-456',
    username: 'homebrew_master',
    avatar_url: '/placeholder.svg?height=100&width=100',
    bio: 'Creating PS2 homebrew games since 2005. Specializing in 3D engines and optimization.',
    projects: [
      'PS2D: 2D Platformer Engine',
      'PS2 Model Viewer',
      'Texture Studio',
    ],
    donation_url: '#homebrew_master',
  },
  {
    id: 'user-789',
    username: 'audio_wizard',
    avatar_url: '/placeholder.svg?height=100&width=100',
    bio: 'Audio programmer focusing on PS2 sound libraries and music players.',
    projects: ['Audio Synthesizer for PS2', 'MIDI Player', 'Sound Library'],
    donation_url: '#audio_wizard',
  },
];
