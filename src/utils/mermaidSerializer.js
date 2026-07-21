export function serializeToMermaid(nodes, edges, diagramType = 'flowchart') {
  if (diagramType === 'architecture') {
    let code = `architecture-beta\n`;
    
    // Render groups first
    const groups = nodes.filter(n => n.type === 'archGroupNode');
    for (const g of groups) {
      const id = g.id.replace(/[^a-zA-Z0-9]/g, '_');
      const label = g.data?.label || 'Group';
      const icon = g.data?.icon || 'cloud';
      code += `    group ${id}(${icon})[${label}]\n`;
    }

    // Render services
    const services = nodes.filter(n => n.type === 'archServiceNode');
    for (const s of services) {
      const id = s.id.replace(/[^a-zA-Z0-9]/g, '_');
      const label = s.data?.label || 'Service';
      const icon = s.data?.icon || 'server';
      const parent = s.parentNode ? ` in ${s.parentNode.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
      code += `    service ${id}(${icon})[${label}]${parent}\n`;
    }

    // Render edges
    for (const e of edges) {
      const source = e.source.replace(/[^a-zA-Z0-9]/g, '_');
      const target = e.target.replace(/[^a-zA-Z0-9]/g, '_');
      
      const sDir = (e.sourceHandle || 'source-bottom').split('-')[1]; 
      const tDir = (e.targetHandle || 'target-top').split('-')[1];
      
      const dirMap = { left: 'L', right: 'R', top: 'T', bottom: 'B' };
      const sL = dirMap[sDir] || 'B';
      const tL = dirMap[tDir] || 'T';
      
      code += `    ${source}:${sL} -- ${tL}:${target}\n`;
    }
    
    return code;
  }

  if (diagramType === 'journey') {
    let code = `journey\n`;
    code += `    title User Journey\n`;

    const sections = nodes.filter(n => n.type === 'journeySectionNode');
    const tasks = nodes.filter(n => n.type === 'journeyTaskNode');

    if (sections.length > 0) {
      // Sort sections by Y position
      const sortedSections = [...sections].sort((a, b) => a.position.y - b.position.y);
      for (const section of sortedSections) {
        code += `    section ${section.data?.label || 'Section'}\n`;
        // Sort tasks inside section by X position
        const sectionTasks = tasks.filter(t => t.parentNode === section.id).sort((a, b) => a.position.x - b.position.x);
        for (const task of sectionTasks) {
          const label = task.data?.label || 'Task';
          const score = task.data?.score !== undefined ? task.data.score : 3;
          const actor = task.data?.actor || 'User';
          code += `      ${label}: ${score}: ${actor}\n`;
        }
      }
    } else {
      // If no sections, just list tasks sorted by X position
      const sortedTasks = [...tasks].sort((a, b) => a.position.x - b.position.x);
      for (const task of sortedTasks) {
        const label = task.data?.label || 'Task';
        const score = task.data?.score !== undefined ? task.data.score : 3;
        const actor = task.data?.actor || 'User';
        code += `      ${label}: ${score}: ${actor}\n`;
      }
    }
    
    return code;
  }

  // Default: Flowchart
  let code = `graph TD\n`; // We can default to TD, or read layout direction if needed
  
  // 1. Declare nodes with shapes
  for (const node of nodes) {
    const id = node.id.replace(/[^a-zA-Z0-9]/g, '_');
    const label = node.data?.label || 'Node';
    
    let openShape = '[';
    let closeShape = ']';
    
    switch (node.type) {
      case 'roundedNode': openShape = '('; closeShape = ')'; break;
      case 'stadiumNode': openShape = '(['; closeShape = '])'; break;
      case 'circleNode': openShape = '(('; closeShape = '))'; break;
      case 'diamondNode': openShape = '{'; closeShape = '}'; break;
      case 'hexagonNode': openShape = '{{'; closeShape = '}}'; break;
      case 'parallelogramNode': openShape = '[/'; closeShape = '/]'; break;
      case 'subroutineNode': openShape = '[['; closeShape = ']]'; break;
      case 'rectangleNode': default: openShape = '['; closeShape = ']'; break;
    }
    
    code += `    ${id}${openShape}${label}${closeShape}\n`;
  }
  
  // 2. Declare edges
  for (const edge of edges) {
    const source = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
    const target = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
    const label = edge.label ? `|${edge.label}|` : '';
    code += `    ${source} -->${label} ${target}\n`;
  }
  
  return code;
}
