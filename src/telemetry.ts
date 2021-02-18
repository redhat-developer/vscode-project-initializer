/*******************************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 * Distributed under license by Red Hat, Inc. All rights reserved.
 * This program is made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 * Red Hat, Inc. - initial API and implementation
 ******************************************************************************/
import { getTelemetryService, TelemetryEvent, TelemetryService } from '@redhat-developer/vscode-redhat-telemetry';
import * as os from 'os';
import ipRegex = require('ip-regex');
import emailRegex = require('email-regex');

const telemetryService: Promise<TelemetryService> = getTelemetryService("redhat.project-initializer");

export async function getTelemetryServiceInstance(): Promise<TelemetryService> {
    return telemetryService;
}

export function createTrackingEvent(name: string, properties: any = {}): TelemetryEvent {
    return {
        type: 'track',
        name,
        properties
    }
}

export async function sendTelemetry(actionName: string, properties?: any): Promise<void> {
    const service = await getTelemetryServiceInstance();
    if (actionName === 'activation') {
        return service?.sendStartupEvent();
    }
    return service?.send(createTrackingEvent(actionName, properties));
}

export function sanitize(message: string) : string {
    message = message.replace(os.homedir(), "$HOME");
    message = message.replace(os.tmpdir(), "$TMPDIR")
    message = message.replace(os.userInfo().username, "$USER")
    message = message.replace(ipRegex(), "$IPADDRESS")
    message = message.replace(emailRegex(), "$EMAIL")
    return message;
}